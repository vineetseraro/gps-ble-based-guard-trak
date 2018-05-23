import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { Dropdown } from './../../../core/global.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LazyLoadEvent, Message, SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';

import { environment } from '../../../../environments/environment.prod';
import { GlobalService } from '../../../core/global.service';
import { Attribute as FloorAttribute, Floor, FloorModel } from '../shared/floor.model';
import { FloorService } from '../shared/floor.service';
import { Attribute } from './../../attributes/shared/attribute.model';
import { AttributesService } from './../../attributes/shared/attributes.service';

@Component({
    selector: 'app-floor-add',
    templateUrl: './floor.component.html',
    styleUrls: ['./floor.component.css'],
    providers: [FloorService, GlobalService, AttributesService]
})
export class FloorComponent implements OnInit, OnDestroy {
    totalRecords: number;
    previousQuery: any;
    msgs: Message[] = [];
    submitted: boolean;
    description: string;
    floorForm: FormGroup;
    data: any;
    private subscription: Subscription;
    title: String = '';
    id: String = '';
    floorModel: Observable<FloorModel>;
    floortypesList: SelectItem[];
    floorOptionList: SelectItem[];
    itemOptionList: SelectItem[];
    itemOptionNameList: SelectItem[];
    attributeList: SelectItem[];
    thingOptionList: SelectItem[] = [];
    parentOptionList: SelectItem[] = [];
    selectedThings:any = [];
    loader = false;
    datalist: Attribute[] = [];
    floor = <Floor>{};
    loadCategory = false;
    tags:any = [];
    category = [];
    floorData: any;
    categoryOptionList: SelectItem[] = [];
    selectedCategory:any = [];
    categoriesDropdown: Dropdown[];
    thingsDropdown: Dropdown[];
    attributeOptionList: SelectItem[];
    attributeNameOptionList: SelectItem[];
    blankAttribute: FloorAttribute;
    displayDialog = false;
    showFloor = false;
    isCategoryInit = false;
    measurementUnit = '';
    radiusUnit = '';
    radiusVal: any;
    countryName = '';
    isEdit = false;
    selectedAttribute: FloorAttribute;
    showDelete = false;
    displayDialogAtt = false;
    dialogTitle: String = '';
    /**
     * Constructor Definition
     * @param FormBuilder
     * @param FloorService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
    constructor(
        private fb: FormBuilder,
        public DashboardService: DashboardService,
        private floorService: FloorService,
        private globalService: GlobalService,
        private router: Router,
        private attributeService: AttributesService,
        private route: ActivatedRoute, ) { }

    /**
     * Action for close button
     * @memberof FloorComponent
     */
    transitionTofloors() {
        this.router.navigate(['/floors']);
    }

    /**
     * Init function definition
     * @memberof FloorComponent
     */
    ngOnInit() {
        this.prepareForm();
        this.fetchDropDown();
        this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('id')) {
                    this.loader = true;
                    this.id = params['id'];
                    this.setEditDefaultStatus();
                    this.floorService.get(this.id).subscribe((data:any) => {
                        this.floor = data.data;
                        // this.tags = this.globalService.getTagKeywords(this.floor.tags);
                        this.selectedCategory = this.globalService.getSelectedItemId(this.floor.categories);
                        this.updateFloor();
                        this.loader = false;
                    });
                    this.title = 'Edit Floor';

                } else {
                    this.floor.attributes = [];
                    this.title = 'Add Floors';
                }
            }
        );
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
            case 'floors': {
                this.globalService.getDropdown('floors' + environment.serverEnv).subscribe((data:any) => {
                    this.itemOptionNameList = this.globalService.prepareHandlerNameList(data.data);
                });
                this.globalService.getDropdown('floors' + environment.serverEnv).subscribe((data:any) => {
                    this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select');
                });
                break;
            }
        }
    }
    /**
     * Function for destroying all the components behavior
     * @memberof FloorComponent
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Fuction for set the form values in edit
     * @memberof FloorComponent
     */
    updateFloor() {
        this.isEdit = true;
        this.showFloor = true;
        this.floorData = this.floor;
        // this.floorData.longitude = this.floor.coordinates.longitude;
        // this.floorData.latitude = this.floor.coordinates.latitude;
           this.tags = this.globalService.getTagKeywords(this.floor.tags);
        /*if (this.floor.radiusUnit !== '' && this.floor.radiusUnit !== undefined) {
            if (window.localStorage.getItem('measurement') !== '' && window.localStorage.getItem('measurement') !== undefined) {
                if (this.floor.radiusUnit !== window.localStorage.getItem('measurement')) {
                    if (this.floor.radiusUnit === 'Imperial') {
                        this.radiusVal = this.floor.radius * 0.3048;
                    } else {
                        this.radiusVal = this.floor.radius * 3.2808399;
                    }
                } else {
                    this.radiusVal = this.floor.radius;
                }
            }
        } else {
            this.radiusVal = this.floor.radius;
        }*/

        this.floorForm.reset({
            code: this.floor.code,
            name: this.floor.name,
            status: this.floor.status,
            parent: this.floor.parent,
            tags: this.tags,
            categories: this.isCategoryInit ? this.selectedCategory : [],
        });
    }
    fetchDropDown() {
        // /// Get the Categories List from API ////
        this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
            this.categoryOptionList = this.globalService.prepareDropDown(data.data, 'Select');
            if (this.categoryOptionList.length > 0 && this.selectedCategory.length > 0) {
                this.updateFloor();
            }

        });

        /// Get the Attribites List from API ////
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
            this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
            this.attributeNameOptionList.unshift({ label: 'Select Attribute', value: null });
        });

        // /// Get Things Dropdown////
        this.globalService.getDropdown('things' + environment.serverEnv + '/beacons').subscribe((data:any) => {
            this.thingOptionList = this.globalService.prepareDropDown(data.data, 'Select');
            if (this.selectedThings.length > 0 && this.thingOptionList.length > 0) {
                this.updateFloor();
            }

        });

        // /// Get Locations Dropdown////
        this.globalService.getDropdown('locations' + environment.serverEnv)
            .subscribe((data:any) => {
                this.parentOptionList = this.globalService.prepareDropDown(data.data, 'Select Location');
            });
    }
    /**
     * Function for preparing the form
     * @memberof FloorComponent
     */
    prepareForm() {

        this.floorForm = this.fb.group({
            'code': ['', [Validators.required]],
            'name': ['', [Validators.required]],
            'parent': ['', [Validators.required]],
            'status': [1],
            'floor': this.fb,
            'categories': [this.category, [Validators.required]],
            'tags': [this.tags],
            'coordinates': this.fb.array([]),
            'attributes': this.fb.array([]),
        });

        /*this.floorForm.controls.attributes = this.fb.group({
            'id': [''],
            'value': ['']
        });

        this.floorForm.controls.coordinates = this.fb.group({
            'longitude': [''],
            'latitude': ['']
        });

        this.floorForm.controls.floor = this.fb.group({
            'address': ['', [Validators.required]],
            'city': ['', [Validators.required]],
            'state': ['', [Validators.required]],
            'country': ['', [Validators.required]],
            'zipcode': ['', [Validators.required]],
            'latitude': [''],
            'longitude': [''],
            'radius': [200]
        });*/

        this.floorForm.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
    }

    handleFloorUpdate(event: any) {
        this.floorData = event.value;
    }

    /**
     * Calling the edit API
     * @param id
     */
    onEdit(id: any) {
        this.router.navigate(['/floors', id, 'edit']);
    }
    /**
     * Navgation back
     * @private
     * @memberof FloorComponent
     */
    private navigateBack() {
        this.globalService.goBack();
        //this.router.navigate(['/floors']);
    }

    /**
     * Submit Action
     * @param {string} value
     * @memberof FloorComponent
     */
    onSubmit(value: any) {
        value = this.prepareFloorData(value);
        this.loader = true;
        //// Prepare POST JSON ////
        if (value.status === true) {
            value.status = 1;
        } else if (value.status === false) {
            value.status = 0;
        }

        if (window.localStorage.getItem('measurement') !== '' && window.localStorage.getItem('measurement') !== undefined) {
            value.radiusUnit = window.localStorage.getItem('measurement');
        }
        this.submitted = true;
        if (this.id === '') {
             this.saveFloor(value);
        } else {
             this.editFloor(value);
        }
    }

    prepareFloorData(value: any) {
        /// Process Address ////
        /*if (this.floorForm.controls.floor.value.address !== '') {
            value.address = this.floorForm.controls.floor.value.address;
        } else {
            value.address = this.floorData.address;
        }
        if (this.floorForm.controls.floor.value.city !== '') {
            value.city = this.floorForm.controls.floor.value.city;
        } else {
            value.city = this.floorData.city;
        }
        if (this.floorForm.controls.floor.value.state !== '') {
            value.state = this.floorForm.controls.floor.value.state;
        } else {
            value.state = this.floorData.state;
        }
        if (this.floorForm.controls.floor.value.country !== '') {
            value.country = this.floorForm.controls.floor.value.country;
        } else {
            value.country = this.floorData.country;
        }
        if (this.floorForm.controls.floor.value.zipcode !== '') {
            value.zipcode = this.floorForm.controls.floor.value.zipcode;
        } else {
            value.zipcode = this.floorData.zipcode;
        }
        if (this.floorForm.controls.floor.value.longitude !== '') {
            value.coordinates.longitude = this.floorForm.controls.floor.value.longitude;
        } else {
            value.coordinates.longitude = this.floorData.longitude;
        }
        if (this.floorForm.controls.floor.value.latitude !== '') {
            value.coordinates.latitude = this.floorForm.controls.floor.value.latitude;
        } else {
            value.coordinates.latitude = this.floorData.latitude;
        }
        if (this.floorForm.controls.floor.value.radius !== '') {
            value.radius = this.floorForm.controls.floor.value.radius;
        } else {
            value.radius = this.floorData.radius;
        }*/

        /// Process Attributes Data ///
        value.attributes = [];
        if (typeof this.attributeOptionList !== 'undefined') {
            for (let i = 0; i < this.floor.attributes.length; i++) {
                const optionss = this.attributeOptionList.filter((x:any) => x.label === this.floor.attributes[i].name);
                if (optionss.length > 0) {
                    value.attributes.push({ value: this.floor.attributes[i].value, id: optionss[0].value });
                }
            }
        }

        this.measurementUnit = window.localStorage.getItem('measurement');
        return value;
    }
    /**
     * Save Floor Function
     * @param {any} value
     * @memberof FloorComponent
     */
    saveFloor(value: any) {
        this.floorService.add(value).subscribe(
           (data:any) => {
                this.data = data.data;
                this.showSuccess('Floor saved successfully');
            },
            (error:any) => {
                this.loader = false;
                this.showError(error);
            }
        );
    }

    /**
     * Edit Floor Function
     * @param {any} value
     * @memberof FloorComponent
     */
    editFloor(value: any) {
        this.floorService.update(value, this.id).subscribe(
           (data:any) => {
                this.data = data;
                this.showSuccess('Floor updated successfully');
            },
            (error:any) => {
                this.loader = false;
                this.showError(error);
            }
        );
    }

    /**
     * Show API Error
     * @param {*} error
     * @memberof FloorComponent
     */
    public showError(error: any) {
        this.msgs = [];
        error.data.forEach((element:any) => {
            this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
        });
    }

    /**
     * Show API Success
     * @param {*} success
     * @memberof FloorComponent
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

        this.attributeService.getAttributes(query).subscribe((data:any) => {
            this.datalist = data.data;
            this.totalRecords = data.totalRecords;

        },
            (error:any) => {
                if (error.code === 210) {
                    this.datalist = [];
                    this.previousQuery = '';
                }
            });
    }

    /**
     * delete Attribute row
     * @param {*} data
     * @memberof ProductComponent
     */
    deleteRow(data:any) {
        data;
        this.floor.attributes = this.floor.attributes.filter(obj => obj !== this.selectedAttribute);
        this.displayDialogAtt = false;
    }


    /**
     * To add Attribute
     * @memberof FloorComponent
    addMoreAttribute() {
        const attributes = [...this.floor.attributes];
        this.blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(this.blankAttribute);
        this.floor.attributes = attributes;
    }*/


    /**
    * call when Category add
    * @param {string} keywords
    * @memberof FloorComponent
    */
    onAddCategory(keywords: any) {
        this.category.push(keywords);
    }

    /**
     * call when remove category
     * @param {string} keywords
     * @memberof FloorComponent
     */
    onRemoveCategory(keywords: any) {
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
            this.floorForm.patchValue({
                categories: this.selectedCategory,
            });

        }

    }

    /**
     * To add Attribute
     * @memberof FloorComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Attribute';
        this.showDelete = false;
        this.displayDialogAtt = true;
        this.floorForm.controls.attributes = this.fb.group({
            'attributeType': ['', [Validators.required]],
            'attributeValue': ['', [Validators.required]],
        });
        this.floorForm.controls.attributes.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event:any) {
        this.dialogTitle = 'Edit Attribute';
        this.showDelete = true;
        this.floorForm.controls.attributes.patchValue({
            attributeType: event.data.name,
            attributeValue: event.data.value,
        });
        this.displayDialogAtt = true;
    }


    /**
     * To save Attribute of floor
     * @memberof FloorComponent
     */
    saveAttributes(data:any) {
        const attributes = [...this.floor.attributes];
        if (this.floor.attributes.indexOf(this.selectedAttribute) < 0) {
            this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes.push(this.blankAttribute);
        } else {
            this.blankAttribute = {
                name: data.attributeType,
                id: data.id, value: data.attributeValue, status: 0, sysDefined: 0
            };
            attributes[this.floor.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
        }
        this.floor.attributes = attributes;
        this.displayDialogAtt = false;
        this.floorForm.controls.attributes.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof FloorComponent
     */
    closeDialog() {
        this.displayDialogAtt = false;
    }

    setEditDefaultStatus() {
        this.floorForm.patchValue({
            status: 0,
        });
    }
}
