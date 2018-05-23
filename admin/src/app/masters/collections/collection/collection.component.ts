import { Attribute } from './../../attributes/shared/attribute.model';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { GlobalService } from '../../../core/global.service';
import { Collection, CollectionModel, Item as CollectionItem, Ancestor as CollectionAncestor } from '../shared/collection.model';
import { CollectionService } from '../shared/collection.service';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem, LazyLoadEvent } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../core/validators/validation.service';


@Component({
    selector: 'app-collection-add',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    providers: [CollectionService, GlobalService, AttributesService, ValidationService]
})
export class CollectionComponent implements OnInit, OnDestroy {
    totalRecords: number;
    previousQuery: any;
    msgs: Message[] = [];
    submitted: boolean;
    description: string;
    collectionForm: FormGroup;
    data: any;
    private subscription: Subscription;
    title: String = '';
    id: String = '';
    collectionModel: Observable<CollectionModel>;
    collectiontypesList: SelectItem[];
    collectionOptionList: SelectItem[];
    itemOptionList: SelectItem[];
    itemOptionNameList: SelectItem[];
    attributeList: SelectItem[];
    loader = false;
    datalist: Attribute[] = [];
    blankItem: CollectionItem;
    blankAncestor: CollectionAncestor;
    collection = <Collection>{};
    loadCategory = false;
    tags:any = [];
    isEdit = false;
    displayDialog = false;
    parentOptionList: SelectItem[];
    selectedAttribute: CollectionItem;
    showDelete = false;
    dialogTitle: String = '';
    // //isStatusEdit = true;
    //  isNameEdit = false;
    // isCodeEdit = false;
    // isTypeEdit = false;
    // isParentEdit = false;
    /**
     * Constructor Definition
     * @param FormBuilder
     * @param CollectionService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
    constructor(
        private fb: FormBuilder,
        public DashboardService: DashboardService,
        private collectionService: CollectionService,
        private globalService: GlobalService,
        private router: Router,
        private attributeService: AttributesService,
        private route: ActivatedRoute,
        private validationService: ValidationService
    ) { }

    /**
     * Init function definition
     * @memberof CollectionComponent
     */
    ngOnInit() {
        this.prepareForm();
        this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('id')) {
                    this.loader = true;
                    this.setEditDefaultStatus();
                    this.id = params['id'];
                    this.collectionService.get(this.id).subscribe((data:any) => {
                        this.collection = data.data;
                        // this.collection.items.push({ id: 'Select Item', name: 'Select Item', sysDefined: 0 });
                        this.updateCollection();
                        this.getParentDropdowns(this.collection.id);
                        this.loader = false;
                    }, (error:any) => this.showError(error));
                    this.title = 'Edit Collection';

                } else {
                    this.collection.items = [];
                    this.title = 'Add Collection';
                    this.getParentDropdowns(null);
                }
            }
        );
    }

    fetchItems(type:any) {
        console.log(type);
        /// Generate Items Dropdown On Listing ////
        switch (type) {
            case 'attributes': {
                this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
                    this.itemOptionNameList = this.globalService.prepareHandlerNameListAddMore(data.data);
                    this.itemOptionList = this.globalService.prepareDropDown(data.data, "Select");
                    this.itemOptionNameList.unshift({ label: 'Select Item', value: null });
                }, (error:any) => this.showError(error));
                break;
            }
            case 'categories': {
                this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
                    this.itemOptionNameList = this.globalService.prepareHandlerNameListAddMore(data.data);
                    this.itemOptionList = this.globalService.prepareDropDown(data.data, "Select");
                    this.itemOptionNameList.unshift({ label: 'Select Item', value: null });
                }, (error:any) => this.showError(error));
                break;
            }
            case 'products': {
                this.globalService.getDropdown('products' + environment.serverEnv).subscribe((data:any) => {
                    this.itemOptionNameList = this.globalService.prepareHandlerNameListAddMore(data.data);
                    this.itemOptionList = this.globalService.prepareDropDown(data.data, "Select");
                    this.itemOptionNameList.unshift({ label: 'Select Item', value: null });
                }, (error:any) => this.showError(error));
                break;
            }
        }
    }
    
    /**
     * Function for destroying all the components behavior
     * @memberof CollectionComponent
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Fuction for set the form values in edit
     * @memberof CollectionComponent
     */
    updateCollection() {
        this.tags = this.globalService.getTagKeywords(this.collection.tags);
        console.log(this.collection.items)
        const disableValue = this.collection.sysDefined === 1 ? true : false;
        this.fetchItems(this.collection.type);
        this.collectionForm.reset({
            id: { value:this.collection.id, disabled:disableValue},
            name: {value:this.collection.name,disabled:disableValue},
            code:  {value:this.collection.code,disabled:true},
            type: {value:this.collection.type, disabled:disableValue},
            sysDefined: this.collection.sysDefined,
            status: {value:this.collection.status,disabled:disableValue},
            tags: this.tags,
            parent: { value: this.collection.parent, disabled: disableValue },
            ancestors: { value: this.collection.ancestors, disabled: disableValue },
            items: { value: this.collection.items, disabled: disableValue },
        });
    }

    /**
     * Function for preparing the form
     * @memberof CollectionComponent
     */
    prepareForm() {
        /// Get the Categories List from API ////
        this.globalService.getDropdown('collections' + environment.serverEnv + '/types').subscribe((data:any) => {
            this.collectiontypesList = this.globalService.prepareDropDown(data.data, "Select collection Type");
            console.log(this.collectiontypesList);
            this.loadCategory = true;
        });
        ;
        this.collectionForm = this.fb.group({
            'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
            'code': ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
            'type': ['', [Validators.required]],
            'status': [1],
            'sysDefined': [0],
            'tags': [this.tags],
            'parent': [''],
            'items': this.fb.array([]),
        });
        this.collectionForm.controls.items = this.fb.group({
            'attributeType': [''],
            //'attributeValue': [''],
        });
    }

    getParentDropdowns(id: any) {
        this.globalService.getParentDropdown('collections' + environment.serverEnv, id).subscribe((data:any) => {
            this.collectionOptionList = this.globalService.prepareDropDown(data.data, "Select Parent");
            this.loadCategory = true;
            this.collectionForm.patchValue({
                parent: this.collection.parent,

            });
        }, (error:any) => this.showError(error))
    }
    /**
     * Calling the edit API
     * @param id
     */
    onEdit(id:any) {
        this.router.navigate(['/collections', id, 'edit']);
    }
    onTagUpdate(event:any) {
        this.tags = event;
    }

    /**
     * Navgation back
     * @private
     * @memberof CollectionComponent
     */
    private navigateBack() {
        this.router.navigate(['/collections']);
    }
    initAttribute() {
        return this.fb.group({
            'id': ['', []],
            'value': ['', []],
        });
    }
    /**
     * Submit Action
     * @param {string} value
     * @memberof CollectionComponent
     */
    onSubmit(value: any) {
        this.loader = true;
        //// Prepare POST JSON ////
        if (value.status === true) {
            value.status = 1;
        } else if (value.status === false) {
            value.status = 0;
        }
            value.items = [];
        if (this.itemOptionList !== undefined && this.collection.items !== undefined) {
            console.log('collection lenght' + this.collection.items.length);
            console.log('collection lenght' + this.collection.items);
            console.log(this.collection.items);
            for (let i = 0; i < this.collection.items.length; i++) {
                if (this.collection.items[i].id !== 'Select Item') {
                    value.items.push(this.collection.items[i].id);
                }

                // const optionss = this.itemOptionList.filter((x:any) => x.label === this.collection.items[i].name);
                // if (optionss !== undefined && optionss.length > 0) {
                //     value.items.push(optionss[0].value);
                // }
            }

        }
        this.submitted = true;
        if (this.id === '') {
            this.saveCollection(value);
        } else {
            this.editCollection(value);
        }
    }

    /**
     * Save Collection Function
     * @param {any} value
     * @memberof CollectionComponent
     */
    saveCollection(value:any) {
        this.collectionService.add(value).subscribe(
           (data:any) => {
                this.data = data.data;
                this.showSuccess('Collection saved successfully');
            },
            (error:any) => {
                this.showError(error);
            }
        );
    }

    /**
     * Edit Collection Function
     * @param {any} value
     * @memberof CollectionComponent
     */
    editCollection(value:any) {
        value.code = this.collection.code;
        console.log(value.items);
        this.collectionService.update(value, this.id).subscribe(
           (data:any) => {
                this.data = data;
                this.showSuccess('Collection updated successfully');
            },
            (error:any) => {
                this.showError(error);
            }
        );
    }

    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.collectionForm, error);
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

    deleteAttributeRow(data: any) {
        const index = this.collection.items.indexOf(data);
        this.collection.items = this.collection.items.filter((val: any, i: any) => { val = val; return i !== index; });
    }

    /*addMoreAttribute() {
        const attributes = [...this.collection.items];
        this.blankItem = { id: 'Select Attribute', name: 'Select Items',sysDefined:0 };
        attributes.push(this.blankItem);
        this.collection.items = attributes;
    }*/

    setEditDefaultStatus()
    {
        this.collectionForm.patchValue({
                    status: 0,

                });
    }

    deleteRow(data:any) {
        data;
        this.collection.items = this.collection.items.filter(obj => obj !== this.selectedAttribute);
        this.displayDialog = false;
    }

    /**
     * To add Attribute
     * @memberof CollectionComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Item';
        this.showDelete = false;
        this.displayDialog = true;
        this.collectionForm.controls.items = this.fb.group({
            'attributeType': ['', [Validators.required]],
            //'attributeValue': ['', [Validators.required]],
        });
        this.collectionForm.controls.items.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event:any) {
        this.dialogTitle = 'Edit Item';
        this.showDelete = true;
        this.collectionForm.controls.items.patchValue({
            attributeType: event.data.id,
        });
        this.displayDialog = true;
    }


    /**
     * To save Attribute of product
     * @memberof CollectionComponent
     */
    saveAttributes(data:any) {
        console.log('in save');
        console.log(data);
        let selectedItem = this.itemOptionNameList.find((x:any) => x.value === data.attributeType) || {label: '', value: ''};
        const attributes = [...this.collection.items];
        this.blankItem = { name: selectedItem.label || '', id: selectedItem.value || '', status: 0, sysDefined: 0 };
        if (this.collection.items.indexOf(this.selectedAttribute) < 0) {
            attributes.push(this.blankItem);
        } else {
            attributes[this.collection.items.indexOf(this.selectedAttribute)] = this.blankItem;
        }
        this.collection.items = attributes;
        this.displayDialog = false;
        this.collectionForm.controls.items.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof CollectionComponent
     */
    closeDialog() {
        this.displayDialog = false;
    }

//     disabledAllField(isEdit:boolean)
// {
//    //this.isStatusEdit = isEdit;
//    this. isNameEdit = isEdit;
//    this.isCodeEdit = isEdit;
//    this.  isTypeEdit = isEdit;
//   this.isParentEdit = isEdit;
// }
}