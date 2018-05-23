import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { Dropdown } from './../../../core/global.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, Message, SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';

import { environment } from '../../../../environments/environment.prod';
import { GlobalService } from '../../../core/global.service';
import { Attribute as ZoneAttribute, Zone, ZoneModel } from '../shared/zone.model';
import { ZoneService } from '../shared/zone.service';
import { Attribute } from './../../attributes/shared/attribute.model';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { FloorService } from './../../floors/shared/floor.service';
import { LocationService } from './../../locations/shared/location.service';

@Component({
  selector: 'app-zone-add',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css'],
  providers: [ZoneService, GlobalService, AttributesService, FloorService, LocationService]
})
export class ZoneComponent implements OnInit, OnDestroy {
  totalRecords: number;
  previousQuery: any;
  msgs: Message[] = [];
  submitted: boolean;
  description: string;
  zoneForm: FormGroup;
  data: any;
  private subscription: Subscription;
  title: String = '';
  id: String = '';
  zoneModel: Observable<ZoneModel>;
  zonetypesList: SelectItem[];
  zoneOptionList: SelectItem[];
  itemOptionList: SelectItem[];
  itemOptionNameList: SelectItem[];
  attributeList: SelectItem[];
  thingOptionList: SelectItem[] = [];
  parentOptionList: SelectItem[] = [];
  locationOptionList: SelectItem[] = [];
  selectedThings: any = [];
  selectedFloor: any = [];
  loader = false;
  datalist: Attribute[] = [];
  zone = <Zone>{};
  loadCategory = false;
  tags: any = [];
  category: any = [];
  zoneData: any;
  categoryOptionList: SelectItem[] = [];
  selectedCategory: any = [];
  tagOptionList: any = [];
  categoriesDropdown: Dropdown[];
  thingsDropdown: Dropdown[];
  attributeOptionList: SelectItem[];
  attributeNameOptionList: SelectItem[];
  blankAttribute: ZoneAttribute;
  displayDialog = false;
  showZone = false;
  isCategoryInit = false;
  measurementUnit: any = '';
  radiusUnit: any = '';
  radiusVal: any;
  countryName: any = '';
  isEdit = false;
  selectedAttribute: ZoneAttribute;
  showDelete = false;
  displayDialogAtt = false;
  dialogTitle: String = '';
  floorArray: any = [];
  isThingInit = false;
  zoneThings: any = [];
  locationData: any;
  // thingTypes = 'beacon,tempTag,nfcTag,gateway,software';
  thingTypes = 'beacon';
  showLocation = false;

  /**
     * Constructor Definition
     * @param FormBuilder
     * @param ZoneService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
  constructor(
    private fb: FormBuilder,
    public DashboardService: DashboardService,
    private zoneService: ZoneService,
    private floorService: FloorService,
    private globalService: GlobalService,
    private router: Router,
    private attributeService: AttributesService,
    private route: ActivatedRoute,
    private locationService: LocationService
  ) {}

  /**
     * Action for close button
     * @memberof ZoneComponent
     */
  transitionTozones() {
    this.router.navigate(['/zones']);
  }

  /**
     * Init function definition
     * @memberof ZoneComponent
     */
  ngOnInit() {
    this.prepareForm();
    this.fetchDropDown();
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.loader = true;
        this.id = params['id'];
        this.setEditDefaultStatus();

        this.zoneService.get(this.id).subscribe(
          (data: any) => {
            this.zone = data.data;
            this.selectedCategory = this.globalService.getSelectedItemId(this.zone.categories);
            this.zoneThings = this.zone.things;
            this.updateZone(this.zone);
          },
          (error: any) => this.showError(error)
        );
        this.title = 'Edit Zone';
      } else {
        this.zone.attributes = [];
        this.title = 'Add Zones';
      }
    });
  }

  fetchItems(type: any) {
    /// Generate Items Dropdown On Listing ////
    switch (type) {
      case 'attributes': {
        this.globalService
          .getDropdown('attributes' + environment.serverEnv)
          .subscribe((data: any) => {
            this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
          });
        this.globalService
          .getDropdown('attributes' + environment.serverEnv)
          .subscribe((data: any) => {
            this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
          });
        break;
      }
      case 'categories': {
        this.globalService
          .getDropdown('categories' + environment.serverEnv)
          .subscribe((data: any) => {
            this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
          });
        this.globalService
          .getDropdown('categories' + environment.serverEnv)
          .subscribe((data: any) => {
            this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
          });
        break;
      }
      case 'zones': {
        this.globalService.getDropdown('zones' + environment.serverEnv).subscribe((data: any) => {
          this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
        });
        this.globalService.getDropdown('zones' + environment.serverEnv).subscribe((data: any) => {
          this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        });
        break;
      }
    }
  }
  /**
     * Function for destroying all the components behavior
     * @memberof ZoneComponent
     */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
     * Fuction for set the form values in edit
     * @memberof ZoneComponent
     */
  updateZone(zone: Zone) {
    this.isEdit = true;
    this.showZone = true;
    this.selectedThings = this.globalService.getSelectedItemId(zone.things);
    this.fetchFloor(zone.ancestors[1].id);
    this.tags = this.globalService.getTagKeywords(this.zone.tags);
    if (zone.radiusUnit !== '' && zone.radiusUnit !== undefined) {
      if (
        window.localStorage.getItem('measurement') !== '' &&
        window.localStorage.getItem('measurement') !== undefined
      ) {
        if (zone.radiusUnit !== window.localStorage.getItem('measurement')) {
          if (zone.radiusUnit === 'Imperial') {
            this.radiusVal = zone.radius * 0.3048;
          } else {
            this.radiusVal = zone.radius * 3.2808399;
          }
        } else {
          this.radiusVal = zone.radius;
        }
      }
    } else {
      this.radiusVal = zone.radius;
    }
    // this.locationData = this.location;
    // this.locationData.longitude = this.location.coordinates.longitude;
    // this.locationData.latitude = this.location.coordinates.latitude;
    this.zoneForm.reset({
      code: zone.code,
      name: zone.name,
      status: zone.status,
      zlocation: zone.ancestors[1].id,
      parent: zone.parent,
      tags: this.tags,
      categories: this.isCategoryInit ? this.selectedCategory : [],
      things: this.isThingInit ? this.selectedThings : [],
      zone: {
        address: this.zone.address,
        city: this.zone.city,
        state: this.zone.state,
        country: this.zone.country,
        zipcode: this.zone.zipcode,
        radius: this.radiusVal,
        longitude: this.zone.coordinates.longitude,
        latitude: this.zone.coordinates.latitude
      },
      coordinates: {
        longitude: this.zone.coordinates.longitude,
        latitude: this.zone.coordinates.latitude
      }
    });
    this.showLocation = true;
    this.loader = false;
  }
  fetchDropDown() {
    // /// Get the Categories List from API ////
    this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data: any) => {
      this.categoryOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      if (this.categoryOptionList.length > 0 && this.selectedCategory.length > 0) {
        this.updateZone(this.zone);
      }
    });

    /// Get the Attribites List from API ////
    this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data: any) => {
      this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
      this.attributeNameOptionList.unshift({ label: 'Select Attribute', value: null });
    });

    // /// Get Things Dropdown////
    this.globalService
      .getDropdown('things' + environment.serverEnv + '/beacons')
      .subscribe((data: any) => {
        this.thingOptionList = this.globalService.prepareDropDown(data.data, 'Select');
        if (this.selectedThings.length > 0 && this.thingOptionList.length > 0) {
          this.updateZone(this.zone);
        }
      });

    // /// Get Locations Dropdown////
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data: any) => {
      this.locationOptionList = this.globalService.prepareDropDown(data.data, 'Select Location');
    });
  }
  /**
     * Function for preparing the form
     * @memberof ZoneComponent
     */
  prepareForm() {
    this.zoneForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      parent: ['', [Validators.required]],
      zlocation: ['', [Validators.required]],
      status: [1],
      zone: this.fb,
      categories: [this.category, [Validators.required]],

      tags: [this.tags],
      coordinates: this.fb.array([]),
      attributes: this.fb.array([]),
      things: [this.selectedThings]
    });

    /*this.zoneForm.controls.attributes = this.fb.group({
            'id': [''],
            'value': ['']
        });
        */
    this.zoneForm.controls.coordinates = this.fb.group({
      longitude: [''],
      latitude: ['']
    });

    this.zoneForm.controls.zone = this.fb.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      radius: [20]
    });

    this.zoneForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
  }

  handleZoneUpdate(event: any) {
    this.zoneData = event.value;
  }

  /**
     * Calling the edit API
     * @param id
     */
  onEdit(id: any) {
    this.router.navigate(['/zones', id, 'edit']);
  }
  /**
     * Navgation back
     * @private
     * @memberof ZoneComponent
     */
  private navigateBack() {
    this.globalService.goBack();
    //this.router.navigate(['/zones']);
  }

  /**
     * Submit Action
     * @param {string} value
     * @memberof ZoneComponent
     */
  onSubmit(value: any) {
    value = this.prepareZoneData(value);
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
    // value.coordinates = {};
    // value.coordinates.latitude = 17.234;
    // value.coordinates.longitude = 17.234;
    // value.radius = 100;
    if (this.id === '') {
      this.saveZone(value);
    } else {
      this.editZone(value);
    }
  }

  prepareZoneData(value: any) {
    /// Process Address ////
    if (this.zoneForm.controls.zone.value.address !== '') {
        value.address = this.zoneForm.controls.zone.value.address;
    } else {
        value.address = this.zoneData.address;
    }
    if (this.zoneForm.controls.zone.value.city !== '') {
        value.city = this.zoneForm.controls.zone.value.city;
    } else {
        value.city = this.zoneData.city;
    }
    if (this.zoneForm.controls.zone.value.state !== '') {
        value.state = this.zoneForm.controls.zone.value.state;
    } else {
        value.state = this.zoneData.state;
    }
    if (this.zoneForm.controls.zone.value.country !== '') {
        value.country = this.zoneForm.controls.zone.value.country;
    } else {
        value.country = this.zoneData.country;
    }
    if (this.zoneForm.controls.zone.value.zipcode !== '') {
        value.zipcode = this.zoneForm.controls.zone.value.zipcode;
    } else {
        value.zipcode = this.zoneData.zipcode;
    }
    if (this.zoneForm.controls.zone.value.longitude !== '') {
        value.coordinates.longitude = this.zoneForm.controls.zone.value.longitude;
    } else {
        value.coordinates.longitude = this.zoneData.longitude;
    }
    if (this.zoneForm.controls.zone.value.latitude !== '') {
        value.coordinates.latitude = this.zoneForm.controls.zone.value.latitude;
    } else {
        value.coordinates.latitude = this.zoneData.latitude;
    }
    if (this.zoneForm.controls.zone.value.radius !== '') {
        value.radius = this.zoneForm.controls.zone.value.radius;
    } else {
        value.radius = this.zoneData.radius;
    }

    /// Process Attributes Data ///
    value.attributes = [];
    if (typeof this.attributeOptionList !== 'undefined') {
      for (let i = 0; i < this.zone.attributes.length; i++) {
        const optionss = this.attributeOptionList.filter(
          (x: any) => x.label === this.zone.attributes[i].name
        );
        if (optionss.length > 0) {
          value.attributes.push({ value: this.zone.attributes[i].value, id: optionss[0].value });
        }
      }
    }

    this.measurementUnit = window.localStorage.getItem('measurement');
    return value;
  }
  /**
     * Save Zone Function
     * @param {any} value
     * @memberof ZoneComponent
     */
  saveZone(value: any) {
    this.zoneService.add(value).subscribe(
      (data: any) => {
        this.data = data.data;
        this.showSuccess('Check Point saved successfully');
      },
      (error: any) => {
        this.loader = false;
        this.showError(error);
      }
    );
  }

  /**
     * Edit Zone Function
     * @param {any} value
     * @memberof ZoneComponent
     */
  editZone(value: any) {
    this.zoneService.update(value, this.id).subscribe(
      (data: any) => {
        this.data = data;
        this.showSuccess('Check Point updated successfully');
      },
      (error: any) => {
        this.loader = false;
        this.showError(error);
      }
    );
  }

  /**
     * Show API Error
     * @param {*} error
     * @memberof ZoneComponent
     */
  public showError(error: any) {
    this.loader = false;
    this.msgs = [];
    if ( error && error.data.length ) {
      error.data.forEach((element: any) => {
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
      });
    }
  }

  /**
     * Show API Success
     * @param {*} success
     * @memberof ZoneComponent
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
      (data: any) => {
        this.datalist = data.data;
        this.totalRecords = data.totalRecords;
      },
      (error: any) => {
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
  deleteRow(data: any) {
    data;
    this.zone.attributes = this.zone.attributes.filter(obj => obj !== this.selectedAttribute);
    this.displayDialogAtt = false;
  }

  /**
    * call when Category add
    * @param {string} keywords
    * @memberof ZoneComponent
    */
  onAddCategory(keywords: string) {
    this.category.push(keywords);
  }

  /**
     * call when remove category
     * @param {string} keywords
     * @memberof ZoneComponent
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
    this.globalService.getTagDropdown(query).subscribe((data: any) => {
      this.globalService.prepareOptionList(data.data);
    });
  }

  onTagUpdate(event: any) {
    this.tags = event;
  }

  onCategoryInit(event: any) {
    this.isCategoryInit = event;
    if (this.selectedCategory.length > 0) {
      this.zoneForm.patchValue({
        categories: this.selectedCategory
      });
    }
  }

  /**
     * To add Attribute
     * @memberof ZoneComponent
     */
  addMoreAttribute() {
    this.dialogTitle = 'Add Attribute';
    this.showDelete = false;
    this.displayDialogAtt = true;
    this.zoneForm.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.zoneForm.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  onRowSelect(event: any) {
    this.dialogTitle = 'Edit Attribute';
    this.showDelete = true;
    this.zoneForm.controls.attributes.patchValue({
      attributeType: event.data.name,
      attributeValue: event.data.value
    });
    this.displayDialogAtt = true;
  }

  /**
     * To save Attribute of zone
     * @memberof ZoneComponent
     */
  saveAttributes(data: any) {
    const attributes = [...this.zone.attributes];
    if (this.zone.attributes.indexOf(this.selectedAttribute) < 0) {
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
      attributes[this.zone.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
    }
    this.zone.attributes = attributes;
    this.displayDialogAtt = false;
    this.zoneForm.controls.attributes.patchValue({
      attributeType: '',
      attributeValue: ''
    });
  }

  /**
     * To close Attribute Dialog
     * @memberof ZoneComponent
     */
  closeDialog() {
    this.displayDialogAtt = false;
  }

  setEditDefaultStatus() {
    this.zoneForm.patchValue({
      status: 0
    });
  }

  /**
     * To fetch floors of a particular location
     * @memberof ProductComponent
     */
  fetchFloor(locationId: any) {
    this.loader = true;
    this.parentOptionList = [];
    this.floorArray = [];
    // if (type) {
    this.parentOptionList.push({ label: 'Select Floor', value: null });
    this.floorService.getFloor(locationId).subscribe(
      (data: any) => {
        this.floorArray = data.data;
        this.parentOptionList = this.globalService.prepareDropDown(this.floorArray, 'Select Floor');
        this.loader = false;
      },
      (error: any) => {
        this.parentOptionList = [{ label: 'No Floors Available', value: null }];
        this.showError(error);
      }
    );

    this.locationService.get(locationId).subscribe(
      (data: any) => {
        let locationChange = true;
        // if (!this.id) {
        //   locationChange = true;
        // } else {
        //   if (locationId !== this.zone.ancestors[1].id) {
        //     locationChange = true;
        //   }
        //   // if(this.zone.ancestors[])
        // }

        if (locationChange === true ) {
          this.locationData = data.data;

          this.showLocation = true;
          this.zoneForm.patchValue({
            zone: {
              address: data.data.address,
              city: data.data.city,
              state: data.data.state,
              country: data.data.country,
              zipcode: data.data.zipcode,
              radius: 10,
              longitude: data.data.coordinates.longitude,
              latitude: data.data.coordinates.latitude
            },
            coordinates: {
              longitude: data.data.coordinates.longitude,
              latitude: data.data.coordinates.latitude
            }
          });
        }
        
        this.loader = false;
      },
      (error: any) => {
        // this.parentOptionList = [{ label: 'No Floors Available', value: null }];
        this.showError(error);
        this.loader = false;
      }
    );
    // }
  }

  /**
     * Initialising Things Dropdown
     * @memberof ZoneComponent
     */
  onThingsInit(event: any) {
    if (typeof event === 'boolean') {
      this.isThingInit = event;
      if (this.selectedThings.length > 0) {
        this.updateThings();
      }
    } else {
      this.showError(event);
    }
  }

  updateThings() {
    this.zoneForm.patchValue({
      things: this.selectedThings
    });
  }
}
