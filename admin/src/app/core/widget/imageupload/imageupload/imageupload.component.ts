import { Component, Input, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';

import { environment } from './../../../../../environments/environment';
import { GlobalService } from './../../../global.service';

@Component({
  selector: 'app-image-upload-widget',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Input() multiple: Boolean;
  @Output() onImageListFinalised: EventEmitter<any> = new EventEmitter();
  uploader: FileUploader;
  title: String = '';
  progress: Number;
  errorMessage: String = '';
  openHelpText = false;
  @Input() savedImages: Array<any>;
  @Input() images: Array<any>;
  imageCount: Number;
  currentItem: Number = 1;
  infoString: String = '';
  allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
  @Input() displayOnly: Boolean;
  constructor(
    private globalService: GlobalService
  ) {
    this.savedImages = [];
    this.images = [];
    this.displayOnly = false;
    const uploaderOptions: FileUploaderOptions = environment.cloudinaryUploaderOptions;
    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      form.append('upload_preset', environment.cloudinaryPreset);
      if (this.title) {
        form.append('context', `photo=${this.title}`);
      }
      form.append('file', fileItem);
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      this.handleUploadProgress(fileItem, progress);
    };

    this.uploader.onAfterAddingAll = (fileItems: any) => {
      this.errorMessage = '';
      this.imageCount = fileItems.length;
    };

    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      this.handleUploadComplete(item, response, status, headers);
    };
  }

  ngOnInit() {

  }
   setFlagForHelptext(flag: boolean) {
        this.openHelpText = flag;
     }

  handleUploadProgress(fileItem: any, progress: any) {
    fileItem = fileItem;
    this.infoString = `Uploading Image ${this.currentItem} of ${this.imageCount}`;
    this.progress = ((progress / 100) + (Number(this.currentItem) - 1)) / (Number(this.imageCount));
  }

  handleUploadComplete(item: any, response: string, status: number, headers: ParsedResponseHeaders) {
    item = item;
    status = status;
    headers = headers;

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      parsedResponse = {};
    }
    let fileType = (parsedResponse.url || '').split('.');
    fileType = fileType[fileType.length - 1];
    if (new Set(this.allowedTypes).has(fileType)) {
      if (this.multiple) {
        this.savedImages.push(this.makeImageObject(parsedResponse.url, parsedResponse.width, parsedResponse.height));
        this.images.push(this.globalService.processImage(parsedResponse));
      } else {
        this.savedImages = [(this.makeImageObject(parsedResponse.url, parsedResponse.width, parsedResponse.height))];
        this.images = [];
        this.images.push(this.globalService.processImage(parsedResponse));
      }
      if (this.currentItem === this.imageCount) {
        this.onImageListFinalised.emit(this.getUploadedImageData());
      }
    } else {
      this.errorMessage = 'One or more file types are not supported.'
    }

    if (this.currentItem === this.imageCount) {
        this.imageCount = 0;
        this.infoString = '';
        this.currentItem = 1;
      } else {
        this.currentItem = this.currentItem.valueOf() + 1;
      }
  }

  hasPendingUploads(): Boolean {
    return (this.infoString !== '');
  }

  getUploadedImageData() {
    return this.savedImages;
  }

  makeImageObject(url: String, width: Number, height: Number): Object {
    return {
      'url': url,
      'meta': {
        'width': width,
        'height': height
      }
    };
  }

  addImagesData(imageList: Array<Object>): void {
    const formattedImageAddData = imageList.map((element: any) => {
      return {
        'url': element['url'],
        'meta': element['meta'],
      };
    });

    this.savedImages = this.savedImages.concat(formattedImageAddData);
  }

  removeImage(url: String, originalUrl: String) {
    if ( this.images ) {
      this.images.forEach((images, index) => {
        images;
        if ( this.images[index][0] && this.images[index][0].source === url ) {
          // delete this.images[index];
          this.images.splice(index, 1);
        }
      });
    }
    this.savedImages = this.savedImages.filter((element) => {
      return element.url !== originalUrl;
    });
    this.onImageListFinalised.emit(this.getUploadedImageData());
  }

}
