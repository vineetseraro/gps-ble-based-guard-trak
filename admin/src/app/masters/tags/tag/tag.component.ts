import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { GlobalService } from '../../../core/global.service';
import { TagService } from '../shared/tag.service';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { AddRequestModel, Tag } from './../shared/tag.model';
import { ValidationService } from '../../../core/validators/validation.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tags-add',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  providers: [TagService, GlobalService, ValidationService],
})

export class TagComponent implements OnInit {
  tags: SelectItem[];
  data: Tag;
  name = '';
  tagForm: FormGroup; // our model driven form
  msgs: Message[] = [];
  id = '';
  tag: Tag;
  title = '';
  display = false;
  loader = false;
  editmessage = '';
  /**
   * Creates an instance of TagComponent.
   * @param {TagService} tagService
   * @param {Router} router
   * @param {FormBuilder} fb
   * @param {ActivatedRoute} route
   * @param {GlobalService} globalService
   * @memberof TagComponent
   */
  constructor(
    private tagService: TagService,
    private router: Router,
    private fb: FormBuilder,
    public DashboardService: DashboardService,
    private route: ActivatedRoute,
    private validationService: ValidationService
  ) { }

  /**
   * Function for closing the modal box
   * @memberof TagComponent
   */
  transitionModel() {
    this.router.navigate(['/tags']);
    this.DashboardService.isMask = false;
  }
  /**
   * Init function
   * @memberof TagComponent
   */
  ngOnInit() {

    this.tagForm = this.fb.group({
      'name': ['', [Validators.required]],
      'status': [true],
      'sysDefined': [{ value: 0, disabled: true }],
    });

    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.id = params['id'];
          this.setEditDefaultStatus();
          this.loader = true;
          this.tagService.getTagDetails(this.id).subscribe((data:any) => {
            this.loader = false;
            this.tag = data.data;
            this.setTagDetails(this.tag);

          });
          this.title = 'Edit Tag';
        } else {
          this.title = 'Add Tag';
        }
      }
    );



  }
  /**
   * Function for submit the form
   * @param {*} value
   * @memberof TagComponent
   */
  onSubmit(value: any) {
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }
    if (this.id === '') {
      this.addtag(value);
    } else {
      this.edittag(value);
    }
  }
  /**
   * Set tags value functions
   * @param {tag} tag
   * @memberof TagComponent
   */
  setTagDetails(tag: Tag) {
    const disableValue = tag.sysDefined === 1 ? true : false;
    if (this.tags === undefined || this.tags === null) {
      this.tags = [];
    }
    disableValue ? this.editmessage = 'You Can not edit System defined tag' : this.editmessage = '';
    this.tagForm.reset({
      name: { value: tag.name, disabled: disableValue },
      status: { value: tag.status === 1 ? true : false, disabled: disableValue },
      sysDefined: { value: tag.sysDefined, disabled: true },
    });


  }


  /**
   * Function for adding the tag
   * @param {*} value
   * @memberof TagComponent
   */
  addtag(value: any) {
    // console.log('value of form=='+ finalTags);
    // const finalTags = this.globalService.getTags(this.tagKeywords, this.tags);
    const addtagRequest: AddRequestModel = {
      name: value.name,
      status: value.status,
      sysDefined: value.sysDefined,
    };
    this.loader = true;
    this.tagService.addTag(addtagRequest).subscribe(
     (data:any) => {
        this.data = data.data;
        this.showSuccess('Tag saved successfully');

      },
      (error:any) => this.showError(error));
  }
  /**
   * Function for editing the tag form
   * @param {*} value
   * @memberof TagComponent
   */
  edittag(value: any) {
    const addtagRequest: AddRequestModel = {
      name: value.name,
      status: value.status,
      sysDefined: value.sysDefined,
    };
    this.loader = true;
    this.tagService.editTag(addtagRequest, this.id).subscribe(
     (data:any) => {
        this.data = data.data;
        this.showSuccess('Tag updated successfully');

      },
      (error:any) => this.showError(error));
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.tagForm, error);
  }

  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.navigateBack();
    }, environment.successMsgTime);
  }

  /**
   * Function for cancel button
   * @memberof TagComponent
   */
  onCancel() {
    this.navigateBack();
  }
  /**
   * Navigate back function
   * @private
   * @memberof TagComponent
   */
  private navigateBack() {
    this.router.navigate(['/tags']);
  }

    setEditDefaultStatus()
  {
    this.tagForm.patchValue({
                status: 0,

            });
  }

}
