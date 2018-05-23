import { ThingsService } from './../../things/shared/things.service';
import { ImageUploadComponent } from '../../../core/widget/imageupload/imageupload/imageupload.component';
import { Attribute } from './../../attributes/shared/attribute.model';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { LocationService } from './../../locations/shared/location.service';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { Product, ProductModel, Attribute as ProductAttribute } from '../shared/product.model';
import { ProductService } from '../shared/product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { FloorService } from './../../floors/shared/floor.service';
import { ZoneService } from './../../zones/shared/zone.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [
    ProductService,
    GlobalService,
    AttributesService,
    ImageUploadComponent,
    LocationService,
    ValidationService,
    FloorService,
    ZoneService,
    ThingsService
  ]
})
export class ProductComponent implements OnInit, OnDestroy {
  savedImages: Array<any> = [];
  relatedImages: Array<any> = [];
  images: Array<any> = [];
  totalRecords: number;
  previousQuery: any;
  msgs: Message[] = [];
  submitted: boolean;
  description: string;
  location: any;
  productForm: FormGroup;
  data: any;
  private subscription: Subscription;
  title: String = '';
  id: String = '';
  productModel: Observable<ProductModel>;
  addressList: any;
  attributeNameOptionList: SelectItem[];
  attributeList: SelectItem[];
  display = false;
  datalist: Attribute[] = [];
  blankAttribute: ProductAttribute;
  product = <Product>{};
  tags:any = [];
  selectedCategory:any = [];
  selectedThings:any = [];
  productThings:any = [];
  loader = false;
  attributeOptionList: SelectItem[];
  isProductInit = false;
  isThingInit = false;
  floorList:any = [];
  zoneList:any = [];
  floorArray:any = [];
  floorId: String = '';
  floorVal: String = '';
  isLocationInit = false;
  isEdit = false;
  displayDialog = false;
  parentOptionList: SelectItem[];
  selectedAttribute: ProductAttribute;
  showDelete = false;
  dialogTitle: String = '';
  zoneArray = [];
  linechartData: any;
  graph: boolean = false;
  thingTypes = 'beacon,tempTag,nfcTag';
  isActive:boolean = false;
  isActiveMessage:String = '';
  /**
     * Constructor Definition
     * @param FormBuilder
     * @param ProductService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private thingService: ThingsService,
    private globalService: GlobalService,
    private router: Router,
    private floorService: FloorService,
    private zoneService: ZoneService,
    private validationService: ValidationService,
    private route: ActivatedRoute
  ) {}

  /**
     * Init function definition
     * @memberof ProductComponent
     */
  ngOnInit() {
    this.prepareForm();
    this.fetchDropDown();
    this.savedImages = [];
    this.relatedImages = [];
    this.images = [];
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.setEditDefaultStatus();
        this.id = params['id'];
        this.loader = true;
        this.productService.get(this.id).subscribe(
         (data:any) => {
            this.loader = false;
            this.product = data.data;
            this.productThings = this.product.things;
            /*this.product.attributes.push({
                            name: 'Select Attribute',
                            id: 'Select Attribute', value: '', status: 0, sysDefined: 0
                        });*/

            this.updateProduct(this.product);
            this.getParentDropdowns(this.product.id);
            this.getTempData();
          },
          (error:any) => this.showError(error)
        );
        this.title = 'Edit Product';
      } else {
        this.product.attributes = [];
        this.title = 'Add Product';
        this.getParentDropdowns(null);
      }
    });
  }

  /**
     * Function for destroying all the components behavior
     * @memberof ProductComponent
     */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getParentDropdowns(productId: string) {
    this.globalService.getParentDropdown('products' + environment.serverEnv, productId).subscribe(
     (data:any) => {
        this.parentOptionList = this.globalService.prepareDropDown(data.data, 'Select Parent');
        this.productForm.patchValue({
          parent: this.product.parent
        });
      },
      (error:any) => this.showError(error)
    );
  }

  /**
     * Fuction for set the form values in edit
     * @memberof ProductComponent
     */
  updateProduct(product: Product) {
    // console.log('update value ' + this.selectedCategory);
    this.isEdit = true;
    this.tags = this.globalService.getTagKeywords(product.tags);
    this.selectedCategory = this.globalService.getSelectedItemId(product.categories);
    this.selectedThings = this.globalService.getSelectedItemId(product.things);
    this.savedImages = Object.assign(product.images);
    if (product.images) {
      product.images.forEach(prodImage => {
        this.images.push(this.globalService.processImage(prodImage));
      });
    }
    this.relatedImages = Object.assign(product.images);
    this.fetchZoneOnUpdate(product.location.id, product.floor.id, product.zone.id);
    this.location = product.location.id;
    this.productForm.patchValue({
      name: product.name,
      code: product.code,
      tags: this.tags,
      location: this.isLocationInit ? product.location.id : null,
      floor: this.floorVal,
      zone: product.zone.id,
      price: product.price,
      things: this.isThingInit ? this.selectedThings : [],
      categories: this.isProductInit ? this.selectedCategory : [],
      description: product.description,
      videoUrl: product.videoUrl,
      parent: '',
      url: product.url,
      images: [],
      status: product.status === 1 ? true : false
    });
  }

  /**
     * Function to fetch dropdown values on the
     * basis of parameter given.
     * @memberof ProductComponent
     */
  fetchDropDown() {
    /// Get the Attribites List from API ////
    this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe(
     (data:any) => {
        this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
        this.attributeNameOptionList.unshift({ label: 'Select Attribute', value: null });
      },
      (error:any) => this.showError(error)
    );

    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe(
     (data:any) => {
        this.addressList = this.globalService.prepareDropDown(data.data, 'Select Location');
        this.isLocationInit = true;
        if (this.location !== undefined && this.location !== null) {
          // console.log('location fetch update prodcut');
          this.productForm.patchValue({
            location: this.product.location.id
          });
        }
      },
      (error:any) => this.showError(error)
    );
  }

  /**
     * Function for preparing the form
     * @memberof ProductComponent
     */
  prepareForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      code: ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
      price: ['', [ValidationService.priceValidator]],
      tags: [this.tags],
      location: [''],
      categories: [this.selectedCategory, [Validators.required]],
      things: [this.selectedThings],
      description: [''],
      floor: [''],
      zone: [''],
      videoUrl: ['', [ValidationService.videoUrlValidator]],
      url: ['', [ValidationService.urlValidator]],
      status: [true],
      images: [],
      parent: '',
      attributes: this.fb.array([])
    });
    this.productForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
  }

  /**
     * Calling the edit API
     * @param {int} id
     * @param id
     */
  onEdit(id:any) {
    this.router.navigate(['/products', id, 'edit']);
  }

  /**
     * Navigation back
     * @private
     * @memberof ProductComponent
     */
  private navigateBack() {
    this.router.navigate(['/products']);
  }

  /**
     * Initialising Attribute
     * @memberof ProductComponent
     */
  initAttribute() {
    return this.fb.group({
      id: ['', []],
      value: ['', []]
    });
  }


  /**
 * Inactive product Action
 */
inactivePrompt(value: any){
  if (value.status === true) {
    this.onSubmit(value);
  } else if (value.status === false) {
    this.isActive = true;
    this.isActiveMessage = 'Saving the product as Inactive will stop its tracking! Do you still want to continue?';
    return false;
  }
}

/**
 *  active/inactive Action
 */
performAction(value: any, userAction:any){
  this.isActive = false;
  if (userAction == 'ok') {
    this.onSubmit(value);
  } else if (userAction == 'cancel') {
    return false;
  }
  console.log(value, userAction);
}

  /**
     * Submit Action
     * @param {string} value
     * @memberof ProductComponent
     */
  onSubmit(value: any) {
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }
    value.attributes = [];
    if (typeof this.attributeOptionList !== 'undefined') {
      for (let i = 0; i < this.product.attributes.length; i++) {
        const optionss = this.attributeOptionList.filter(
          (x:any) => x.label === this.product.attributes[i].name
        );
        if (optionss.length > 0) {
          value.attributes.push({ value: this.product.attributes[i].value, id: optionss[0].value });
        }
      }
    }
    this.submitted = true;
    value.images = this.relatedImages;
    if (this.id === '') {
      this.saveProduct(value);
    } else {
      this.editProduct(value);
    }
  }

  /**
     * Save Product Function
     * @param {any} value
     * @memberof ProductComponent
     */
  saveProduct(value) {
    this.loader = true;
    this.productService.add(value).subscribe(
     (data:any) => {
        this.data = data.data;
        this.showSuccess('Product saved successfully');
      },
      (error:any) => this.showError(error)
    );
  }

  /**
     * Edit Product Function
     * @param {any} value
     * @memberof ProductComponent
     */
  editProduct(value) {
    this.loader = true;
    value.code = this.product.code;
    this.productService.update(value, this.id).subscribe(
     (data:any) => {
        this.data = data;
        this.showSuccess('Product updated successfully');
      },
      (error:any) => this.showError(error)
    );
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.productForm, error);
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
     * delete Attribute row
     * @param {*} data
     * @memberof ProductComponent
     */
  deleteRow(data:any) {
    data;
    this.product.attributes = this.product.attributes.filter(obj => obj !== this.selectedAttribute);
    this.displayDialog = false;
  }

  /**
     * To add Attribute
     * @memberof ProductComponent
     */
  /*addMoreAttribute() {
        const attributes = [...this.product.attributes];
        this.blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0 };
        attributes.push(this.blankAttribute);
        this.product.attributes = attributes;
    }*/

  /**
     * When tags are updated.
     * @memberof ProductComponent
     */
  onTagUpdate(event) {
    this.tags = event;
  }

  /**
     * Initialising Category Dropdown
     * @memberof ProductComponent
     */
  onCategoryInit(event) {
    if (typeof event === 'boolean') {
      this.isProductInit = event;
      if (this.selectedCategory.length > 0) {
        this.updateCategories();
      }
    } else {
      this.showError(event);
    }
  }

  /**
     * Initialising Things Dropdown
     * @memberof ProductComponent
     */
  onThingsInit(event) {
    if (typeof event === 'boolean') {
      this.isThingInit = event;
      if (this.selectedThings.length > 0) {
        this.updateThings();
      }
    } else {
      this.showError(event);
    }
  }

  updateCategories() {
    this.productForm.patchValue({
      categories: this.selectedCategory
    });
  }

  updateThings() {
    this.productForm.patchValue({
      things: this.selectedThings
    });
  }

  /**
     * On finalising the upload images of product.
     * @memberof ProductComponent
     */
  onImageListFinalised(event) {
    this.relatedImages = event;
  }

  /**
     * Function to navigate to previous page
     * @memberof CategoryComponent
     */
  onCancel() {
    this.navigateBack();
  }

  /**
     * To fetch floors of a particular location
     * @memberof ProductComponent
     */
  fetchFloor(type, floorId = null, zoneId = null) {
    this.floorList = [];
    this.zoneList = [];
    this.floorArray = [];

    this.loader = true;

    // if (type) {
    // console.log('set blank floorlist');
    this.floorList.push({ label: 'Select Floor', value: null });
    this.floorService.getFloor(type).subscribe(
     (data:any) => {
        // console.log(data);
        this.floorArray = data.data;
        // console.log('Floor Array' + this.floorArray);
        this.floorList = this.globalService.prepareDropDown(this.floorArray, 'Select Floor');
        this.zoneList = [];
        // console.log('Floor List' + this.floorList.length);
        this.loader = false;
        if (floorId != null) {
          // edit mode
          this.productForm.patchValue({ floor: floorId });
          this.fetchZone(floorId, zoneId);
        }
      },
      (error:any) => {
        this.floorList = [{ label: 'No Floors Available', value: null }];
        this.showError(error);
      }
    );
    // }
  }

  /**
     * To fetch zones of a particular floor
     * @memberof ProductComponent
     */
  fetchZone(type, zoneId = null) {
    this.zoneList = [];
    this.zoneArray = [];
    this.loader = true;
    // if (type !== null) {
    this.zoneList.push({ label: 'Select Check Point', value: null });
    // console.log('fetch zone called ' + type);
    this.zoneService.getZone(type).subscribe(
     (data:any) => {
        // console.log(data);
        this.zoneArray = data.data;
        this.zoneList = this.globalService.prepareDropDown(this.zoneArray, 'Select Check Point');
        // console.log('Zone List' + this.zoneList.length);
        this.loader = false;
        if (zoneId != null) {
          this.productForm.patchValue({ zone: zoneId });
        }
      },
      (error:any) => {
        this.zoneList = [{ label: 'No Check Points Available', value: null }];
        this.showError(error);
      }
    );
    // }
    // this.zoneArray = [];
  }

  /**
     * function called to fetch zones and floor on the basis
     * of location and zone id for edit view.
     * @param {string} locationId
     * @param {string} floorId
     * @param {string} zoneId
     * @memberof ProductComponent
     */
  fetchZoneOnUpdate(locationId, floorId, zoneId) {
    if (locationId) {
      this.fetchFloor(locationId, floorId, zoneId);
      // this.locationService.get(locationId).subscribe((data:any) => {
      //     this.floorArray = data.data.floors;
      //     this.floorList = this.globalService.prepareDropDown(data.data.floors, 'Select Floor');
      //     for (let i = 0; i < this.floorArray.length; i++) {
      //         for (let k = 0; k < this.floorArray[i].zones.length; k++) {
      //             if (zoneId === this.floorArray[i].zones[k].id) {
      //                 this.zoneList = this.globalService.prepareDropDown(this.floorArray[i].zones, 'Select Check Point');
      //                 this.floorId = this.floorArray[i].id;
      //             }
      //         }
      //     }
      //     this.productForm.patchValue({ floor: this.floorId });
      // },
      //     (error:any) => this.showError(error));
    }
  }

  /**
     * To add Attribute
     * @memberof ProductComponent
     */
  addMoreAttribute() {
    this.dialogTitle = 'Add Attribute';
    this.showDelete = false;
    this.displayDialog = true;
    this.productForm.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.productForm.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  tempGraph() {
    this.graph = true;
  }

  onRowSelect(event) {
    this.dialogTitle = 'Edit Attribute';
    this.showDelete = true;
    this.productForm.controls.attributes.patchValue({
      attributeType: event.data.name,
      attributeValue: event.data.value
    });
    this.displayDialog = true;
  }

  /**
     * To save Attribute of product
     * @memberof ProductComponent
     */
  saveAttributes(data:any) {
    const attributes = [...this.product.attributes];
    if (this.product.attributes.indexOf(this.selectedAttribute) < 0) {
      this.blankAttribute = {
        name: data.attributeType,
        id: '',
        value: data.attributeValue,
        status: 0,
        sysDefined: 0
      };
      attributes.push(this.blankAttribute);
    } else {
      this.blankAttribute = {
        name: data.attributeType,
        id: data.id,
        value: data.attributeValue,
        status: 0,
        sysDefined: 0
      };
      attributes[this.product.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
    }
    this.product.attributes = attributes;
    this.displayDialog = false;
    this.productForm.controls.attributes.patchValue({
      attributeType: '',
      attributeValue: ''
    });
  }

  /**
     * To close Attribute Dialog
     * @memberof ProductComponent
     */
  closeDialog() {
    this.displayDialog = false;
  }

  setEditDefaultStatus() {
    this.productForm.patchValue({
      status: 0
    });
  }
  getTempData() {
    this.loader = true;
    this.thingService.getProductTemperatureData(this.id).subscribe((data:any) => {
      const tempData = data.data;
      var max = [],
        min = [],
        waves = [];

      tempData.forEach(arr => {
        arr.forEach(data => {
          let stTime = data.startTime;
          let endTime = data.endTime;
          const c = data.cycle * 1000;
          const temp: any = {};
          const maxTemp = data.maxTemp;
          const minTemp = data.minTemp;

          max.push({ x: stTime, y: maxTemp });
          max.push({ x: endTime, y: maxTemp });
          min.push({ x: stTime, y: minTemp });
          min.push({ x: endTime, y: minTemp });

          temp.key = data.sensor.name;
          temp.color = '#7777ff';
          // data.temp = [
          //   31.6,
          //   29.4,
          //   27.4,
          //   27.2,
          //   25.6,
          //   25.3,
          //   25.3,
          //   24.9,
          //   24.8,
          //   24.7,
          //   24.7,
          //   24.7,
          //   24.7,
          //   24.7,
          //   24.7,
          //   24.7,
          //   24.8,
          //   24.9,
          //   24.9
          // ];
          temp.values =
            (data.temp || []).map((element:any) => {
              stTime += c;

              return { x: stTime, y: element };
            }) || [];

          if (data.locationTracking.length > 0) {
            console.log('in data location tracking');
            console.log(data.locationTracking);
            const scanLoc: any = {};
            scanLoc.key = 'Scan Location';
            scanLoc.color = '#000000';

            scanLoc.values =
              (data.locationTracking || []).map((element:any) => {
                return { x: element.ts, y: minTemp - 10 };
              }) || [];
            waves.push(scanLoc);
          }

          waves.push(temp);
        });
      });
      //Line chart data should be sent as an array of series objects.
      this.linechartData = [
        {
          values: max, //values - represents the array of {x,y} data points
          key: 'Max Temperature', //key  - the name of the series.
          color: '#ff7f0e' //color - optional: choose your own line color.
        },
        {
          values: min,
          key: 'Min Temperature',
          color: '#2ca02c'
        }
      ].concat(waves);
      this.loader = false;
    });
    //   {
    //   code: 200,
    //   message: 'Success',
    //   description: 'Success',
    //   data: [
    //     [
    //       {
    //         startTime: 1476943317000,
    //         endTime: 1477565282000,
    //         breachCount: 1,
    //         breachDuration: 621960,
    //         lastRecordedTemp: 24.7,
    //         minRecordedTemp: 23.2,
    //         maxRecordedTemp: 31.6,
    //         avgTemp: 25.878125,
    //         kineticMeanTemp: 25.8703602716002,
    //         totalDuration: 0,
    //         uid: '408443299',
    //         cycle: 120,
    //         maxTemp: 15,
    //         minTemp: 2,
    //         breachInfos: [
    //           {
    //             breachType: 'Max',
    //             minMaxTemp: 31.6,
    //             avgTemp: 25.878125,
    //             duration: 621960,
    //             end: 1477565282000,
    //             start: 1476943322000
    //           }
    //         ],
    //         temp: [
    //           31.6,
    //           29.4,
    //           27.4,
    //           27.2,
    //           25.6,
    //           25.3,
    //           25.3,
    //           24.9,
    //           24.8,
    //           24.7,
    //           24.7,
    //           24.7,
    //           24.7,
    //           24.7,
    //           24.7,
    //           24.7,
    //           24.8,
    //           24.9,
    //           24.9
    //         ]
    //       },
    //       {
    //         startTime: 1477560282000,
    //         endTime: 1478565282000,
    //         breachCount: 1,
    //         breachDuration: 621960,
    //         lastRecordedTemp: 24.7,
    //         minRecordedTemp: 23.2,
    //         maxRecordedTemp: 31.6,
    //         avgTemp: 25.878125,
    //         kineticMeanTemp: 25.8703602716002,
    //         totalDuration: 0,
    //         uid: '408443298',
    //         cycle: 120,
    //         maxTemp: 15,
    //         minTemp: 2,
    //         breachInfos: [
    //           {
    //             breachType: 'Max',
    //             minMaxTemp: 31.6,
    //             avgTemp: 25.878125,
    //             duration: 621960,
    //             end: 1477565282000,
    //             start: 1476943322000
    //           }
    //         ],
    //         temp: [31.6, 29.4, 27.4, 27.2, 25.6, 25.3, 25.3, 24.9, 24.8, 24.7, 24.7, 24.7, 24.7]
    //       }
    //     ]
    //   ]
    // };
  }
}
