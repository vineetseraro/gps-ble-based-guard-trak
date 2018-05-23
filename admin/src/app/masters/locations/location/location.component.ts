import { environment } from '../../../../environments/environment.prod';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, Message, SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';
import { Dropdown } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';
import {
  Attribute as LocationAttribute,
  Location,
  LocationModel
} from '../shared/location.model';
import { LocationService } from '../shared/location.service';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { Attribute } from './../../attributes/shared/attribute.model';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { AkPhoneCodeComponent } from '../../../core/widget/phonecode/ak-phonecode.component';
import { ValidationService } from '../../../core/validators/validation.service';

@Component({
  selector: 'app-location-add',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [LocationService, GlobalService, AttributesService, ValidationService]
})
export class LocationComponent implements OnInit, OnDestroy {
  totalRecords: number;
  previousQuery: any;
  msgs: Message[] = [];
  submitted: boolean;
  description: string;
  locationForm: FormGroup;
  data: any;
  private subscription: Subscription;
  title: String = '';
  id: String = '';
  countryList: SelectItem[] = [];
  countryApiResult: any = [];
  locationModel: Observable<LocationModel>;
  locationtypesList: SelectItem[];
  locationOptionList: SelectItem[];
  itemOptionList: SelectItem[];
  itemOptionNameList: SelectItem[];
  attributeList: SelectItem[];
  thingOptionList: SelectItem[] = [];
  selectedThings:any = [];
  loader = false;
  datalist: Attribute[] = [];
  location = <Location>{};
  loadCategory = false;
  tags:any = [];
  category = [];
  locationData: any;
  categoryOptionList: SelectItem[] = [];
  selectedCategory:any = [];
  categoriesDropdown: Dropdown[];
  thingsDropdown: Dropdown[];
  attributeOptionList: SelectItem[];
  attributeNameOptionList: SelectItem[];
  blankAttribute: LocationAttribute;
  displayDialog = false;
  showLocation = false;
  isCategoryInit = false;
  measurementUnit: any = '';
  radiusUnit = '';
  radiusVal: any;
  countryName = '';
  isEdit = false;
  selectedAttribute: LocationAttribute;
  showDelete = false;
  displayDialogAtt = false;
  dialogTitle: String = '';
  @ViewChild(AkPhoneCodeComponent) phoneComponent: AkPhoneCodeComponent;
  /**
     * Constructor Definition
     * @param FormBuilder
     * @param LocationService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
  constructor(
    private fb: FormBuilder,
    public DashboardService: DashboardService,
    private validationService: ValidationService,
    private locationService: LocationService,
    private globalService: GlobalService,
    private router: Router,
    private attributeService: AttributesService,
    private route: ActivatedRoute
  ) {}

  /**
     * Action for close button
     * @memberof LocationComponent
     */
  transitionTolocations() {
    this.router.navigate(['/locations']);
  }

  /**
     * Init function definition 
     * @memberof LocationComponent
     */
  ngOnInit() {
    this.prepareForm();
    this.fetchDropDown();
    this.globalService.getCountryPhoneCode().subscribe((data:any) => {
      this.countryApiResult = data.data;
      this.countryList = data.data.map((x:any) => {
        return {
          label: '+' + x.dialCode + ' (' + x.name + ')',
          value: x.shortCode
        };
      });

      this.countryList = [
        {
          label: 'Select',
          value: ''
        },
        ...this.countryList
      ];
    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.loader = true;
        this.id = params['id'];
        this.setEditDefaultStatus();
        this.locationService.get(this.id).subscribe((data:any) => {
          this.location = data.data;
          //this.tags = this.globalService.getTagKeywords(this.location.tags);
          this.selectedCategory = this.globalService.getSelectedItemId(this.location.categories);
          this.updateLocation();
          this.loader = false;
        });
        this.title = 'Edit Location';
      } else {
        this.location.attributes = [];
        this.title = 'Add Locations';
      }
    });
  }

  fetchItems(type: any) {
    /// Generate Items Dropdown On Listing ////
    switch (type) {
      case 'attributes': {
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
        });
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        });
        break;
      }
      case 'categories': {
        this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
        });
        this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        });
        break;
      }
      case 'locations': {
        this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
        });
        this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
          this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        });
        break;
      }
    }
  }
  /**
     * Function for destroying all the components behavior
     * @memberof LocationComponent
     */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
     * Fuction for set the form values in edit
     * @memberof LocationComponent
     */
  updateLocation() {
    this.isEdit = true;
    this.showLocation = true;
    this.locationData = this.location;
    this.locationData.longitude = this.location.coordinates.longitude;
    this.locationData.latitude = this.location.coordinates.latitude;
    this.tags = this.globalService.getTagKeywords(this.location.tags);
    if (this.location.radiusUnit !== '' && this.location.radiusUnit !== undefined) {
      if (
        window.localStorage.getItem('measurement') !== '' &&
        window.localStorage.getItem('measurement') !== undefined
      ) {
        if (this.location.radiusUnit !== window.localStorage.getItem('measurement')) {
          if (this.location.radiusUnit === 'Imperial') {
            this.radiusVal = this.location.radius * 0.3048;
          } else {
            this.radiusVal = this.location.radius * 3.2808399;
          }
        } else {
          this.radiusVal = this.location.radius;
        }
      }
    } else {
      this.radiusVal = this.location.radius;
    }

    this.locationForm.reset({
      code: this.location.code,
      name: this.location.name,
      status: this.location.status,
      phonecode: this.location.phonecode || this.getShortCodeFromCountryName(this.location.country),
      PhoneNumber: this.location.phone,
      tags: this.tags,
      categories: this.isCategoryInit ? this.selectedCategory : [],
      location: {
        address: this.location.address,
        city: this.location.city,
        state: this.location.state,
        country: this.location.country,
        zipcode: this.location.zipcode,
        radius: this.radiusVal,
        longitude: this.location.coordinates.longitude,
        latitude: this.location.coordinates.latitude
      },
      coordinates: {
        longitude: this.location.coordinates.longitude,
        latitude: this.location.coordinates.latitude
      }
    });
  }
  fetchDropDown() {
    // /// Get the Categories List from API ////
    this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
      this.categoryOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      if (this.categoryOptionList.length > 0 && this.selectedCategory.length > 0) {
        this.updateLocation();
      }
    });

    /// Get the Attribites List from API ////
    this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
      this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
      this.attributeNameOptionList.unshift({ label: 'Select Attribute', value: null });
    });

    // /// Get Things Dropdown////
    this.globalService
      .getDropdown('things' + environment.serverEnv + '/beacons')
      .subscribe((data:any) => {
        this.thingOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        if (this.selectedThings.length > 0 && this.thingOptionList.length > 0) {
          this.updateLocation();
        }
      });
  }
  /**
     * Function for preparing the form
     * @memberof LocationComponent
     */
  prepareForm() {
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.locationOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      this.loadCategory = true;
    });

    this.locationForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: [1],
      phonecode: ['', [ValidationService.phoneValidator]],
      PhoneNumber: ['', [ValidationService.phoneValidator]],
      location: this.fb,
      categories: [this.category, [Validators.required]],
      tags: [this.tags],
      coordinates: this.fb.array([]),
      attributes: this.fb.array([])
    });

    this.locationForm.controls.attributes = this.fb.group({
      id: [''],
      value: ['']
    });

    this.locationForm.controls.coordinates = this.fb.group({
      longitude: [''],
      latitude: ['']
    });

    this.locationForm.controls.location = this.fb.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      radius: [200]
    });

    this.locationForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
  }

  handleLocationUpdate(event: any) {
    this.locationData = event.value;
    this.locationForm
      .get('phonecode')
      .setValue(
        this.getShortCodeFromCountryName(this.locationForm.controls.location.value.country)
      );
  }

  /**
     * Calling the edit API
     * @param id
     */
  onEdit(id: any) {
    this.router.navigate(['/locations', id, 'edit']);
  }
  /**
     * Navgation back
     * @private
     * @memberof LocationComponent
     */
  private navigateBack() {
    this.router.navigate(['/locations']);
  }
  initAttribute() {
    return this.fb.group({
      id: ['', []],
      value: ['', []]
    });
  }
  /**
     * Submit Action
     * @param {string} value
     * @memberof LocationComponent
     */
  onSubmit(value: any) {
    value = this.prepareLocationData(value);
    this.loader = true;
    //// Prepare POST JSON ////
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }

    if (
      window.localStorage.getItem('measurement') !== '' &&
      window.localStorage.getItem('measurement') !== undefined
    ) {
      value.radiusUnit = window.localStorage.getItem('measurement');
    }
    this.submitted = true;

    if (this.id === '') {
      this.saveLocation(value);
    } else {
      this.editLocation(value);
    }
  }

  prepareLocationData(value: any) {
    /// Process Address ////
    // if (this.locationForm.controls.location.value.address !== '') {
    value.address = this.locationForm.controls.location.value.address;
    // } else {
    //     value.address = this.locationData.address;
    // }
    // if (this.locationForm.controls.location.value.city !== '') {
    value.city = this.locationForm.controls.location.value.city;
    // } else {
    //     value.city = this.locationData.city;
    // }
    // if (this.locationForm.controls.location.value.state !== '') {
    value.state = this.locationForm.controls.location.value.state;
    // } else {
    //     value.state = this.locationData.state;
    // }
    // if (this.locationForm.controls.location.value.country !== '') {
    value.country = this.locationForm.controls.location.value.country;
    // } else {
    //     value.country = this.locationData.country;
    // }
    // if (this.locationForm.controls.location.value.zipcode !== '') {
    value.zipcode = this.locationForm.controls.location.value.zipcode;
    // } else {
    //     value.zipcode = this.locationData.zipcode;
    // }
    // if (this.locationForm.controls.location.value.longitude !== '') {
    value.coordinates.longitude = this.locationForm.controls.location.value.longitude;
    // } else {
    //     value.coordinates.longitude = this.locationData.longitude;
    // }
    // if (this.locationForm.controls.location.value.latitude !== '') {
    value.coordinates.latitude = this.locationForm.controls.location.value.latitude;
    // } else {
    //     value.coordinates.latitude = this.locationData.latitude;
    // }
    // if (this.locationForm.controls.location.value.radius !== '') {
    value.radius = this.locationForm.controls.location.value.radius;
    // } else {
    //     value.radius = this.locationData.radius;
    // }

    /// Process Attributes Data ///
    value.attributes = [];
    if (typeof this.attributeOptionList !== 'undefined') {
      for (let i = 0; i < this.location.attributes.length; i++) {
        const optionss = this.attributeOptionList.filter(
          (x:any) => x.label === this.location.attributes[i].name
        );
        if (optionss.length > 0) {
          value.attributes.push({
            value: this.location.attributes[i].value,
            id: optionss[0].value
          });
        }
      }
    }
    value.radiusUnit = window.localStorage.getItem('measurement');
    this.measurementUnit = window.localStorage.getItem('measurement');
    value.phone = value.PhoneNumber;
    return value;
  }
  /**
     * Save Location Function
     * @param {any} value
     * @memberof LocationComponent
     */
  saveLocation(value: any) {
    this.locationService.add(value).subscribe(
     (data:any) => {
        this.data = data.data;
        this.showSuccess('Location saved successfully');
      },
      (error:any) => {
        this.showError(error);
      }
    );
  }

  /**
     * Edit Location Function
     * @param {any} value
     * @memberof LocationComponent
     */
  editLocation(value: any) {
    this.locationService.update(value, this.id).subscribe(
     (data:any) => {
        this.data = data;
        this.showSuccess('Location updated successfully');
      },
      (error:any) => {
        this.showError(error);
      }
    );
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.locationForm, error);
  }

  /**
     * Show API Success
     * @param {*} success
     * @memberof LocationComponent
     */
  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.navigateBack();
    }, environment.successMsgTime);
  }

  /**
   * Load data for query
   * @param {LazyLoadEvent} event
   * @memberof AttributeListComponent
   */
  loadData(event: LazyLoadEvent) {
    const currentQuery: string = this.globalService.prepareQuery(event);
    if (currentQuery !== this.previousQuery) {
      this.getAttributes(currentQuery);
      this.previousQuery = currentQuery;
    }
  }
  /**
     * Get the list of all attributes
     * @param {string} query
     * @memberof AttributeListComponent
     */
  public getAttributes(query: string) {
    this.attributeService.getAttributes(query).subscribe(
     (data:any) => {
        this.datalist = data.data;
        this.totalRecords = data.totalRecords;
      },
      (error:any) => {
        if (error.code === 210) {
          this.datalist = [];
          this.previousQuery = '';
        }
      }
    );
  }

  /**
     * delete Attribute row
     * @param {*} data
     * @memberof ProductComponent
     */
  deleteRow(data:any) {
    data;
    this.location.attributes = this.location.attributes.filter(obj => obj !== this.selectedAttribute);
    this.displayDialogAtt = false;
  }

  /**
     * To add Attribute
     * @memberof ProductComponent
    addMoreAttribute() {
        const attributes = [...this.location.attributes];
        this.blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(this.blankAttribute);
        this.location.attributes = attributes;
    }*/

  /**
    * call when Category add
    * @param {string} keywords 
    * @memberof ProductComponent
    */
  onAddCategory(keywords: string) {
    this.category.push(keywords);
  }

  /**
     * call when remove category
     * @param {string} keywords 
     * @memberof ProductComponent
     */
  onRemoveCategory(keywords: string) {
    const index = this.category.indexOf(keywords);
    if (index !== -1) {
      this.category.splice(index, 1);
    }
  }

  /**
     * call when tag add
     * @param {string} keywords
     * @memberof ProductComponent
     */
  onAddTag(keywords: string) {
    this.tags.push(keywords);
  }

  /**
     * call when Tag remove
     * @param {string} keywords
     * @memberof ProductComponent
     */
  onRemoveTag(keywords: string) {
    const index = this.tags.indexOf(keywords);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }
  onTextChange(query: string) {
    this.globalService.getTagDropdown(query).subscribe((data:any) => {
      this.globalService.prepareOptionList(data.data);
    });
  }

  onTagUpdate(event: any) {
    this.tags = event;
  }
  onCategoryInit(event: any) {
    this.isCategoryInit = event;
    if (this.selectedCategory.length > 0) {
      this.locationForm.patchValue({
        categories: this.selectedCategory
      });
    }
  }

  /**
     * To add Attribute
     * @memberof LocationComponent
     */
  addMoreAttribute() {
    this.dialogTitle = 'Add Attribute';
    this.showDelete = false;
    this.displayDialogAtt = true;
    this.locationForm.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.locationForm.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  onRowSelect(event: any) {
    this.dialogTitle = 'Edit Attribute';
    this.showDelete = true;
    this.locationForm.controls.attributes.patchValue({
      attributeType: event.data.name,
      attributeValue: event.data.value
    });
    this.displayDialogAtt = true;
  }

  /**
     * To save Attribute of location
     * @memberof LocationComponent
     */
  saveAttributes(data:any) {
    const attributes = [...this.location.attributes];
    if (this.location.attributes.indexOf(this.selectedAttribute) < 0) {
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
      attributes[this.location.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
    }
    this.location.attributes = attributes;
    this.displayDialogAtt = false;
    this.locationForm.controls.attributes.patchValue({
      attributeType: '',
      attributeValue: ''
    });
  }

  /**
     * To close Attribute Dialog
     * @memberof LocationComponent
     */
  closeDialog() {
    this.displayDialogAtt = false;
  }

  setEditDefaultStatus() {
    this.locationForm.patchValue({
      status: 0
    });
  }

  getShortCodeFromCountryName(countryName: string) {
    return (
      (this.countryApiResult.find(x => {
        return String(x.name).trim() === String(countryName);
      }) || {}).shortCode || ''
    );
  }
}
