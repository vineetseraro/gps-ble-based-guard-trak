import { GlobalService } from '../../../core/global.service';
import { ProductService } from '../../products/shared/product.service';
import { Attribute as OrderAttribute, Item as OrderItem, Order, OrderOrchestration, Location } from '../shared/order.model';
import { OrderService } from '../shared/order.service';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { UserPoolGroupService } from './../../userpools/shared/userpool.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { ConfirmationService } from 'primeng/primeng';
import * as moment from 'moment';
import { ValidationService } from '../../../core/validators/validation.service';
import { OrderStatusPipe } from './../../../core/pipes/order-status.pipe';
import { StringUtil } from './../../../core/string.util';
import { ShipmentService } from '../../shipments/shared/shipment.service';

@Component({
    selector: 'app-order-add',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    providers: [OrderService, GlobalService, AttributesService, ProductService,
    ValidationService, OrderStatusPipe, ShipmentService, ConfirmationService]
})
export class OrderComponent implements OnInit, OnDestroy {
    msgs: Message[] = [];
    orderForm: FormGroup;
    data: any;
    private subscription: Subscription;
    title: String = '';
    id: any = '';
    blankItem: OrderItem;
    attributeOptionList: SelectItem[];
    attributeOptionNameList: SelectItem[];
    addressList: any;
    blankAttribute: OrderAttribute;
    itemOptionList: SelectItem[];
    users: SelectItem[];
    // itemOptionNameList: SelectItem[];
    itemOptionNameList: any;
    order = <Order>{};
    tags: any = [];
    loader = false;
    selectedFromAddress: string;
    selectedToAddress: string;
    selectedSalesRepUser: string;
    orderStatus: string;
    edit = false;
    statusClass: string;
    things: any;
    separator = '<^^>';
    displayDialogAtt = false;
    displayDialog = false;
    dialogTitle: String = '';
    selectedAttribute: OrderAttribute;
    selectedItem: OrderItem;
    showDelete = false;
    dialogTitleItem: String = '';
    allUsers:any;
    menuItems: any = [];
    emptyMessage = '';
    orderOrchestration: OrderOrchestration[];
    totalOrchestrationRecords = 0;
    orderStatusLabel = '';
    displayDialogNotes = false;
    comments: Array<any> = [];
    issueList: Array<any> = [];
    selectedShipmentForNote: string;
    noteRelatedImages: Array<any> = [];
    noteImages: Array<any> = [];
    noteSavedImages: Array<any> = [];
    savedProducts: Array<any> = [];
    commentAreaFlag = false;
    noteItemRequired = false;
    issueShipmentMap: any = [];
    orderShipments: any = [];
    orderUnShippedItems: any = [];
    productParent = 'order';
    locationMatchProducts = '';

    /**
     * Constructor Definition
     * @param FormBuilder
     * @param OrderService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
    constructor(
        private fb: FormBuilder,
        private orderService: OrderService,
        private globalService: GlobalService,
        private router: Router,
        private route: ActivatedRoute,
        private userPoolGroupService: UserPoolGroupService,
        private productService: ProductService,
        private validationService: ValidationService,
        private orderStatusPipe: OrderStatusPipe,
        private shipmentService: ShipmentService,
        private confirmationService: ConfirmationService
    ) { }

    /**
     * Init function definition
     * @memberof OrderComponent
     */
    ngOnInit() {
        this.prepareForm();
        this.prepareOrder();
    }

    prepareOrder() {
        this.loader = true;
        this.emptyMessage = StringUtil.emptyMessage;
        const self = this;
        this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('id')) {
                    // self.loader = true;
                    self.id = params['id'];
                    self.orderService.get(self.id).subscribe((data:any) => {
                        self.order = data.data;
                        self.title = self.order.code;
                        self.updateOrder();
                        self.loader = false;
                    },
                   (err:any) => self.showError(err));
                    self.edit = true;
                } else {
                    // check if copy order
                    if (params.hasOwnProperty('copyfrom')) {
                        // self.loader = true;
                        self.orderService.get(params['copyfrom']).subscribe((data:any) => {
                            self.order = data.data;
                            self.copyOrder();
                        },
                       (err:any) => self.showError(err));
                    } else {
                        self.loader = false;
                    }

                    self.order.attributes = [];
                    self.order.products = [];
                    const orderedDate = self.orderService.formatDate(new Date().toISOString());
                    self.orderForm.patchValue({
                        orderedDate: orderedDate,
                    });
                    self.title = 'Add Order';
                    self.edit = false;
                    self.menuItems = [
                        {
                            label: 'SAVE AS DRAFT',
                            action: 'draft',
                            command: (event:any) => {
                                self.saveData(event);
                            }
                        },
                        {
                            label: 'SAVE AS OPEN',
                            action: 'open',
                            command: (event:any) => {
                                self.saveData(event);
                            }
                        }
                    ];
                }
            }
        );
    }

    /**
     * Action to show products mismatch Location with ship from location
     * @memberof OrderComponent
     */
    productsMatchLocationConfirmBox(orderData:any) {
        const self = this;
        this.confirmationService.confirm({
            message: this.locationMatchProducts,
            header: 'Location Match',
            icon: 'fa fa-question-circle',
            accept: () => {
                self.onSubmit(orderData);
            },
            reject: () => {
                //
            }
        });
    }

    checkIfProductLocationMismatch (action:any, orderData:any) {
        this.locationMatchProducts = '';
        if ( action === 'open' || action === 'edit' ) {
            const productsWithLocationMatch:any = [];
            if ( this.order.products && this.orderForm.value.toAddress ) {
                this.order.products.forEach( (product, i) => {

                    //  set product current location
                    if ( product.isAlreadySaved ) {
                        const selProdData = this.itemOptionNameList.filter((x:any) => x.value === product.value);
                        let prodCurrentLocation = <Location>{};
                        if (selProdData.length) {
                            prodCurrentLocation = selProdData[0].currentLocation;
                        }
                        this.order.products[i].currentLocation = prodCurrentLocation;
                    }

                    if (
                        // !product.isAlreadySaved &&
                        product.currentLocation &&
                        product.currentLocation.id === this.orderForm.value.toAddress
                    ) {
                        productsWithLocationMatch.push(product.name);
                    }
                });
                if ( productsWithLocationMatch.length ) {
                    const currentLocation = this.addressList.filter((x:any) => x.value === this.orderForm.value.toAddress);
                    let locMatchStr = 'Product(s) ';
                    locMatchStr += '<b>' + productsWithLocationMatch.join(', ') + '</b>';
                    locMatchStr += ' are already at <b>' + currentLocation[0].label + '</b> location';
                    locMatchStr += ' and internal shipment will be created for these products. Do you still want to continue ?';
                    this.locationMatchProducts = locMatchStr;
                    this.productsMatchLocationConfirmBox(orderData);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Common function to handle order save request
     * @param {any} event
     * @memberof OrderComponent
     */
    saveData(event:any) {
        const action = event.item.action;
        const orderFormData = this.orderForm.value;
        switch (action) {
            case 'draft':
                orderFormData.orderStatus = environment.orderStatus.Draft;
                orderFormData.action = 'draft';
                break;
            case 'open':
                orderFormData.orderStatus = environment.orderStatus.Open;
                orderFormData.action = 'open';
                break;
            case 'edit':
                orderFormData.action = 'edit';
                break;
        }

        const matchLocationFound = this.checkIfProductLocationMismatch(action, orderFormData);

        if ( action === 'draft' ) {
            this.validationService.removeValidation(this.orderForm, 'etd');
        } else {
            this.validationService.addValidation(this.orderForm, 'etd', Validators.required);
        }

        if ( !matchLocationFound ) {
            this.onSubmit(orderFormData);
        }
    }

    /**
     * Function for destroying all the components behavior
     * @memberof OrderComponent
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Function to get order Orchestration
     * @memberof OrderComponent
     */
    getOrderOrchestration() {
        this.loader = true;
        if (this.id) {
            this.orderService.getOrderOrchestration(this.id).subscribe((data:any) => {
                const result = data.data;
                this.emptyMessage = StringUtil.emptyMessage;
                this.totalOrchestrationRecords = data.data.length;
                this.orderOrchestration = result;
                this.totalOrchestrationRecords = data.totalRecords;
                this.loader = false;
            },
                (error:any) => {
                    this.emptyMessage = StringUtil.emptyMessage;
                    if (error.code === 210) {
                        this.orderOrchestration = [];
                    }
                    this.loader = false;
                });
        } else {
            this.emptyMessage = StringUtil.emptyMessage;
        }
    }

    /**
     * Function to get order shipments
     * @memberof OrderComponent
     */
    getShipments() {
        // console.log(this.orderShipments);
        this.orderShipments = this.order.shipments.map( (shipment) => {
            return shipment;
        });

        const shippedItems:any = [];
        this.orderShipments.forEach( (shipment:any) => {
            shipment.products.map( (product:any) => {
                shippedItems.push(product.id);
            });
        });

        for (const i in shippedItems) {
            if (shippedItems[i]) {
                this.orderUnShippedItems = this.orderUnShippedItems.filter((x:any) => x.id !== shippedItems[i]);
                this.order.products = this.order.products.filter((val, index) => {
                    index;
                    if ( val.id === shippedItems[i] ) {
                        val.isEditable = false;
                    }
                    return val;
                });
            }
        }
    }

    /**
     * Fuction for set the form values in edit
     * @memberof OrderComponent
     */
    updateOrder() {
        this.orderShipments = [];
        this.orderUnShippedItems = [];
        this.menuItems = [];
        this.orderStatusLabel = this.order.orderStatusLabel;
        const self = this;
        if (this.order.products.length) {
            for (let i = 0; i < this.order.products.length; i++) {
                const prodOrderKey = this.order.products[i].name + this.separator + this.order.products[i].code +
                    this.separator + this.order.products[i].id;
                this.order.products[i].value = prodOrderKey;
                this.order.products[i].isEditable = true;
                this.order.products[i].isAlreadySaved = true;
                this.orderUnShippedItems.push(this.order.products[i]);
            }
        }

        if (this.order.orderStatus) {
            this.orderStatus = this.orderStatusPipe.transform(this.order.orderStatus);
            if (this.orderStatus) {
                this.statusClass = this.orderStatus.toLowerCase();
            }
        }

        // get addresses
        let toAddress = '';
        if (this.order.addresses) {
            this.order.addresses.forEach(address => {
                if (address.addressType === 'toAddress') {
                    toAddress = address.location.id;
                }
            });
        }
        this.selectedToAddress = toAddress;

        let salesRepUserId = '';
        if (this.order.consumer) {
            if (this.order.consumer.hasOwnProperty('uuid')) {
                salesRepUserId = this.order.consumer.uuid;
            }
        }
        this.selectedSalesRepUser = salesRepUserId;

        let expectedCompletionDate = '';
        if (this.order.expectedCompletionDate) {
            expectedCompletionDate = this.orderService.formatDate(this.order.expectedCompletionDate);
        }
        const orderedDate = this.orderService.formatDate(this.order.orderedDate);

        let etd = '';
        if (this.order.etd) {
            etd = this.orderService.formatDate(this.order.etd);
        }
        this.tags = this.globalService.getTagKeywords(this.order.tags);
        if (this.tags === undefined || this.tags === null) {
            this.tags = [];
        }

        const orderStatus = this.order.orderStatus;

        if ( orderStatus !== environment.orderStatus.Closed || orderStatus !== environment.orderStatus.Canceled  ) {
            if (orderStatus === environment.orderStatus.Draft) {
                this.menuItems.push(
                    {
                        label: 'SAVE AS DRAFT',
                        action: 'draft',
                        command: (event:any) => {
                            self.saveData(event);
                        }
                    }
                );
                this.menuItems.push(
                    {
                        label: 'SAVE AS OPEN',
                        action: 'open',
                        command: (event:any) => {
                            self.saveData(event);
                        }
                    }
                );
            } else if (
                orderStatus === environment.orderStatus.Open ||
                orderStatus === environment.orderStatus.PartialShipped ||
                orderStatus === environment.orderStatus.Shipped
            ) {
                this.menuItems.push(
                    {
                        label: 'SAVE',
                        action: 'edit',
                        command: (event:any) => {
                            self.saveData(event);
                        }
                    }
                );
            }

            // close condition
            if (
                // orderStatus === environment.orderStatus.PartialDelivered ||
                orderStatus !== environment.orderStatus.Closed
            ) {
                this.menuItems.push(
                    {
                        label: 'CLOSE',
                        command: (event:any) => {
                            event;
                            self.clearError();
                            self.closeOrderConfirmBox();
                        }
                    }
                );
            }

            // cancel condition
            if (
                // orderStatus === environment.orderStatus.Draft ||
                // orderStatus === environment.orderStatus.Open ||
                // orderStatus === environment.orderStatus.PartialShipped ||
                // orderStatus === environment.orderStatus.Shipped
                orderStatus !== environment.orderStatus.Closed &&
                orderStatus !== environment.orderStatus.Canceled
            ) {
                this.menuItems.push(
                    {
                        label: 'CANCEL',
                        command: (event:any) => {
                            event;
                            self.clearError();
                            self.cancelOrderConfirmBox();
                        }
                    }
                );
            }
        }

        // if ( orderStatus !== environment.orderStatus.Canceled ) {
            this.menuItems.push(
                {
                    label: 'COPY',
                    command: (event:any) => {
                        event;
                        self.navigateToDetails(this.id, 'copy');
                    }
                }
            );
        // }

        // this.orderForm.controls['code'].disable();
        this.orderForm.controls['orderedDate'].disable();
        this.orderForm.reset({
            code: this.order.code,
            tags: this.tags,
            status: this.order.status,
            orderedDate: orderedDate,
            expectedCompletionDate: expectedCompletionDate,
            etd: etd,
            toAddress: toAddress,
            salesRepUser: salesRepUserId,
            notes: this.order.notes,
            patient: this.order.patient,
            surgeon: this.order.surgeon,
            surgery: this.order.surgery,
        });

        this.getOrderOrchestration();
        this.getShipments();
        this.getIssueData();
    }


    /**
     * Fuction for set the form values in copy mode
     * @memberof OrderComponent
     */
    copyOrder() {
        this.orderShipments = [];
        this.orderUnShippedItems = [];
        this.order.orderStatus = 0;
        this.order.attributes = [];

        const orderedDate = this.orderService.formatDate(new Date().toISOString());

        // get addresses
        let toAddress = '';
        if (this.order.addresses) {
            this.order.addresses.forEach(address => {
                if (address.addressType === 'toAddress') {
                    toAddress = address.location.id;
                }
            });
        }
        this.selectedToAddress = toAddress;

        let salesRepUserId = '';
        if (this.order.consumer) {
            if (this.order.consumer.hasOwnProperty('uuid')) {
                salesRepUserId = this.order.consumer.uuid;
            }
        }
        this.selectedSalesRepUser = salesRepUserId;

        this.tags = this.globalService.getTagKeywords(this.order.tags);
        if (this.tags === undefined || this.tags === null) {
            this.tags = [];
        }

        if (this.order.products.length) {
            for (let i = 0; i < this.order.products.length; i++) {
                const prodOrderKey = this.order.products[i].name + this.separator + this.order.products[i].code +
                    this.separator + this.order.products[i].id;
                this.order.products[i].value = prodOrderKey;
                this.order.products[i].isEditable = true;
                this.order.products[i].deliveryStatus = environment.itemStatus.Open;
                this.order.products[i].isAlreadySaved = true;
            }
        }

        this.orderForm.reset({
            code: this.order.code,
            orderedDate: orderedDate,
            tags: this.tags,
            status: this.order.status,
            toAddress: toAddress,
            salesRepUser: salesRepUserId,
            notes: this.order.notes,
            patient: this.order.patient,
            surgeon: this.order.surgeon,
            surgery: this.order.surgery,
        });
        this.loader = false;

    }


    /**
     * Action to show Cancel Order ConfirmBox
     * @memberof OrderComponent
     */
    cancelOrderConfirmBox() {
        const self = this;
        this.confirmationService.confirm({
            message: 'Order/ Items/ Shipments ( if applicable ) will be marked as canceled. Do you still want to continue?',
            header: 'Cancel Order',
            icon: 'fa fa-question-circle',
            accept: () => {
                self.cancelOrder(self.id);
            },
            reject: () => {
                //
            }
        });
    }

    /**
     * Action to show Close Order ConfirmBox
     * @memberof OrderComponent
     */
    closeOrderConfirmBox() {
        const self = this;
        this.confirmationService.confirm({
            message: 'Order/ Items/ Shipments ( if applicable ) will be marked as closed. Do you still want to continue?',
            header: 'Close Order',
            icon: 'fa fa-question-circle',
            accept: () => {
                self.closeOrder(self.id);
            },
            reject: () => {
                //
            }
        });
    }


    /**
     * Params order id
     * Close Order
     * @memberof OrderComponent
     */
    closeOrder ( orderId:any ) {
        this.loader = true;
        const self = this;
        this.orderService.close(orderId).subscribe(
           (data:any) => {
                data;
                self.msgs = [];
                self.msgs.push({ severity: 'success', summary: 'Success', detail: 'Order closed successfully' });
                self.loader = false;
                self.navigateToDetails(self.id, 'edit');
            },
            (error:any) => this.showError(error)
        );
    }

    /**
     * Params order id
     * Cancel Order
     * @memberof OrderComponent
     */
    cancelOrder ( orderId:any ) {
        this.loader = true;
        const self = this;
        this.orderService.cancel(orderId).subscribe(
           (data:any) => {
                data;
                self.msgs = [];
                self.msgs.push({ severity: 'success', summary: 'Success', detail: 'Order cancelled successfully' });
                self.loader = false;
                self.navigateToDetails(self.id, 'edit');
            },
            (error:any) => this.showError(error)
        );
    }

    /**
     * Function for preparing the form
     * @memberof OrderComponent
     */
    prepareForm() {
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
            this.attributeOptionNameList = this.globalService.prepareHandlerNameList(data.data);
            this.attributeOptionNameList.unshift({ label: 'Select Attribute', value: null });
        });
        this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
            this.addressList = this.globalService.prepareDropDown(data.data, 'Select To Address');
        });

        // get items which has things attached
        this.things = [];
        this.productService.getAll('/orders').subscribe((data:any) => {
            this.itemOptionNameList = [{ value: null, label: 'Select Product' }];
            const result = data.data;
            for (let i = 0; i < result.length; i++) {
                const prod = <any>result[i];
                this.itemOptionNameList.push({
                    // product name + this.separator + productcode + this.separator + prod id
                    value: prod.name + this.separator + prod.code + this.separator + prod.id,
                    label: prod.name,
                    currentLocation: prod.currentLocation
                });
                this.things.push({
                    'productCode': result[i].code, // assumed it is unique
                    'things': result[i].things
                });
            }
            this.itemOptionList = this.globalService.prepareDropDown(data.data, 'Select Product');
        });

        this.userPoolGroupService.listUsersInGroup('AkSalesRep').subscribe((data:any) => {
            this.allUsers = [{ id: '', name: 'Select Sales Representative' }];
            for (let i = 0; i < data['Users'].length; i++) {
                const isApproved = data['Users'][i].Attributes.filter((x:any) => (x.Name === 'custom:isAdminApproved' && x.Value === 'yes'));
                if (isApproved.length) {
                    const sub = data['Users'][i].Attributes.filter((x:any) => x.Name === 'sub')[0].Value;
                    const fName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'given_name')[0].Value;
                    const lName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'family_name')[0].Value;
                    const email = data['Users'][i].Attributes.filter((x:any) => x.Name === 'email')[0].Value;
                    const mobileObj = data['Users'][i].Attributes.filter((x:any) => x.Name === 'custom:MobileNumber');
                    let mobileNo = '';
                    if (mobileObj.length) {
                        mobileNo = mobileObj[0].Value;
                    }
                    this.allUsers.push({
                        'id': sub,
                        'name': fName + ' ' + lName,
                        'firstName': fName,
                        'lastName': lName,
                        'email': email,
                        'mobileNo': mobileNo
                    });
                }
            }
            this.users = this.globalService.prepareDropDown(this.allUsers, '');
        });

        this.orderForm = this.fb.group({
            'code': ['', [Validators.required, ValidationService.required]],
            'toAddress': ['', [Validators.required]],
            'expectedCompletionDate': [''],
            'orderedDate': ['', [Validators.required]],
            'etd': [''],
            'tags': [this.tags],
            'status': [1],
            'attributes': this.fb.array([]),
            'items': [this.fb.array([])],
            'salesRepUser': [''],
            'surgeon': [''],
            'surgery': [''],
            'patient': [''],
            'notes': ['']
        });
        this.orderForm.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
        this.orderForm.controls.items = this.fb.group({
            'itemType': [''],
            'itemValue': [''],
        });
        this.orderForm.controls.issue = this.fb.group({
            'shipment': [''],
            'comment': ['']
        });
    }

    /**
     * Calling the edit API
     * @param id
     */
    onEdit(id:any) {
        this.router.navigate(['/orders', id, 'edit']);
    }

    /**
     * Function to set orderno on item selection from list
     * @memberof OrderComponent
     */
    itemSelected(itemOrderRef:any) {
        if (itemOrderRef != null) {
            const itemOrderRefObj = itemOrderRef.split(this.separator);
            // get things for product
            const selProdThingsData = this.things.filter((x:any) => x.productCode === itemOrderRefObj[itemOrderRefObj.length - 2]);
            if (selProdThingsData.length) {
                this.orderForm.controls.items.patchValue({
                    itemValue: selProdThingsData[0].things[0].name,
                });
            }
        }
    }


    /**
     * Navgation back
     * @private
     * @memberof OrderComponent
     */
    private navigateBack() {
        // this.globalService.goBack();
        this.router.navigate(['/orders']);
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
     * @memberof OrderComponent
     */
    onSubmit(value: any) {
        this.clearError();
        // console.log(value);
        if ( !this.orderForm.valid ) {
            this.validationService.validateAllFormFields(this.orderForm);
            return false;
        }

        const addArr = [];
        if (value.toAddress) {
            addArr.push({ 'addressType': 'toAddress', 'location': { 'id': value.toAddress } });
            // delete value.toAddress;
        }
        value.addresses = addArr;

        value.attributes = [];
        if (typeof this.order !== 'undefined') {
            for (const i in this.order.attributes) {
                if (this.order.attributes[i] !== null) {
                    const selAttribute = this.attributeOptionList.filter((x:any) => x.label === this.order.attributes[i].name);
                    if (selAttribute.length > 0) {
                        value.attributes.push({
                            id: selAttribute[0].value,
                            name: this.order.attributes[i].name,
                            value: this.order.attributes[i].value
                        });
                    }
                }
            }
        }

        value.products = [];
        if (typeof this.itemOptionNameList !== 'undefined') {
            for (const i in this.order.products) {
                if (this.order.products[i] !== null && this.order.products[i].name !== 'Select Product') {
                    const selProdData = this.itemOptionNameList.filter((x:any) => x.value === this.order.products[i].value);
                    if (selProdData.length) {
                        let prodId = '';
                        if (!this.order.products[i].id) {
                            const prodOrderData = selProdData[0].value.split(this.separator);
                            prodId = prodOrderData[prodOrderData.length - 1]
                        } else {
                            prodId = this.order.products[i].id;
                        }
                        value.products.push({
                            id: prodId
                        });
                    }
                }
            }
        }

        // value.consumer = { 'uuid': '', 'name': '', 'firstName': '', 'lastName': '', 'email': '', 'mobileNo': '' };
        value.consumer = '';
        if (typeof this.users !== 'undefined') {
            const salesRepUserId = value.salesRepUser;
            if (salesRepUserId !== '') {
                const salesRepUserData = this.allUsers.filter((x:any) => x.id === salesRepUserId);
                if (salesRepUserData.length) {
                    value.consumer = {
                        'uuid': salesRepUserId,
                        'name': salesRepUserData[0].name,
                        'firstName': salesRepUserData[0].firstName,
                        'lastName': salesRepUserData[0].lastName,
                        'email': salesRepUserData[0].email,
                        'mobileNo': salesRepUserData[0].mobileNo
                    };
                }
            }
        }
        this.loader = true;
        if (value.expectedCompletionDate) {
            value.expectedCompletionDate = this.orderService.processDate(value.expectedCompletionDate);
        }
        if (value.etd) {
            value.etd = this.orderService.processDate(value.etd);
        }
        if (this.id === '') {
            if (value.orderedDate) {
                value.orderedDate = this.orderService.processDate(value.orderedDate);
            }
            this.saveOrder(value);
        } else {
            value.orderedDate = this.order.orderedDate; // to by pass validation
            this.editOrder(value);
        }
    }

    /**
     * Save Order Function
     * @param {any} value
     * @memberof OrderComponent
     */
    saveOrder(value:any) {
        const self = this;
        this.orderService.add(value).subscribe(
           (data:any) => {
                self.msgs = [];
                self.msgs.push({ severity: 'success', summary: 'Success', detail: 'Order created successfully' });
                self.data = data.data;
                self.loader = false;
                self.navigateToDetails(self.data.id, 'add');
            },
            (error:any) => this.showError(error));
    }

    /**
     * Edit Order Function
     * @param {any} value
     * @memberof OrderComponent
     */
    editOrder(value:any) {
        const self = this;
        this.orderService.update(value, this.id).subscribe(
           (data:any) => {
                self.msgs = [];
                self.msgs.push({ severity: 'success', summary: 'Success', detail: 'Order updated successfully' });
                self.data = data;
                self.loader = false;
                self.navigateToDetails(self.id, 'edit');
            },
            (error:any) => this.showError(error));
    }

    /**
     * Navgation to details
     * @private
     * Params id
     * @memberof OrderComponent
     */
    private navigateToDetails(id = null, action:any) {
        if (id !== null) {
            const self = this;
            if (action === 'copy') {
                self.router.navigate(['/orders', 'add', id]);
            } else if (action === 'edit') {
                setTimeout(function () {
                    self.prepareOrder();
                }, 1000);
            } else { // add
                setTimeout(function () {
                    self.router.navigate(['/orders', id, 'edit']);
                }, 1000);
            }
        } else {
            this.navigateBack();
        }
    }

    /**
     * Show API Error
     * @param {*} error
     * @memberof OrderComponent
     */
    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.orderForm, error);
    }

    /**
     * clear API Error
     * @memberof OrderComponent
     */
    public clearError() {
        this.validationService.clearErrors();
    }

    /**
     * Add Tag
     * @param {string} keywords
     * @memberof OrderComponent
     */
    onAddTag(keywords: string) {
        this.tags.push(keywords);
    }

    /**
     * Delete Tag
     * @param {string} keywords
     * @memberof OrderComponent
     */
    onRemoveTag(keywords: string) {
        const index = this.tags.indexOf(keywords);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }

    /**
     * To add Attribute
     * @memberof OrderComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Attribute';
        this.showDelete = false;
        this.displayDialogAtt = true;
        this.orderForm.controls.attributes = this.fb.group({
            'attributeType': ['', [Validators.required]],
            'attributeValue': ['', [Validators.required]],
        });
        this.orderForm.controls.attributes.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event:any) {
        if ( !this.edit
            || (
                this.order.orderStatus === environment.orderStatus.Draft ||
                this.order.orderStatus === environment.orderStatus.Open ||
                this.order.orderStatus === environment.orderStatus.PartialShipped ||
                this.order.orderStatus === environment.orderStatus.Shipped
                )
         ) {
            this.dialogTitle = 'Edit Attribute';
            this.showDelete = true;
            this.orderForm.controls.attributes.reset({
                attributeType: '',
                attributeValue: '',
            });
            this.orderForm.controls.attributes = this.fb.group({
                'attributeType': ['', [Validators.required]],
                'attributeValue': ['', [Validators.required]],
            });
            this.orderForm.controls.attributes.patchValue({
                attributeType: event.data.name,
                attributeValue: event.data.value,
            });
            this.displayDialogAtt = true;
        } else {
            this.selectedAttribute = <any>Array;
        }
    }


    /**
     * To save Attribute of location
     * @memberof OrderComponent
     */
    saveAttributes(data:any) {
        const attributes = [...this.order.attributes];
        if (this.order.attributes.indexOf(this.selectedAttribute) < 0) {
            this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue };
            attributes.push(this.blankAttribute);
        } else {
            this.blankAttribute = {
                name: data.attributeType,
                id: data.id, value: data.attributeValue
            };
            attributes[this.order.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
        }
        this.order.attributes = attributes;
        this.displayDialogAtt = false;
        this.orderForm.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
        this.orderForm.controls.attributes.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof OrderComponent
     */
    closeDialog() {
        this.displayDialogAtt = false;
        this.selectedAttribute = <any>Array;
        this.orderForm.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
    }

    /**
     * delete Attribute row
     * @param {*} data
     * @memberof OrderComponent
     */
    deleteRow(data:any) {
        data;
        this.order.attributes = this.order.attributes.filter(obj => obj !== this.selectedAttribute);
        this.displayDialogAtt = false;
    }

    /**
     * To add Attribute
     * @memberof OrderComponent
     */
    addMoreItem() {
        this.dialogTitleItem = 'Assign Products';
        this.showDelete = false;
        this.displayDialog = true;
        this.orderForm.controls.items = this.fb.group({
            'itemType': ['', [Validators.required]],
            'itemValue': [''],
        });

        this.orderForm.controls.items.reset({
            itemType: '',
            itemValue: '',
        });
    }

    onRowSelectItems(event:any) {
        // if (  event.data.deliveryStatus === environment.itemStatus.Open ) {
        if (  event.data.isEditable ) {
            this.dialogTitleItem = 'Assign Products';
            this.showDelete = true;

            this.orderForm.controls.items.reset({
                itemType: '',
                itemValue: '',
            });
            this.orderForm.controls.items = this.fb.group({
                'itemType': ['', [Validators.required]],
                'itemValue': [''],
            });

            this.orderForm.controls.items.patchValue({
                itemType: event.data.value,
                itemValue: event.data.things[0].name,
            });
            this.displayDialog = true;
        } else {
            this.selectedItem = <any>Array;
        }
    }


    /**
     * Reset row selection for attributes and items
     * @param {any} type
     * @memberof OrderComponent
     */
    dialogHideEvent(type:any) {
        if (type === 'item') {
            this.selectedItem = <any>Array;
            this.displayDialog = false;
            // remove validation
            this.orderForm.controls.items = this.fb.group({
                'itemType': [''],
                'itemValue': [''],
            });
        } else if (type === 'attribute') {
            this.selectedAttribute = <any>Array;
        }
    }


    /**
     * To save Attribute of location
     * @memberof OrderComponent
     */
    saveItems(data:any) {
        let thingsArr = [];
        const itemOrderRefObj = data.itemType.split(this.separator);
        // const selProdDataNew = {};this.order.products.filter((x:any) => x.name === data.itemType);
        // if ( selProdDataNew.length ) {
        const id = itemOrderRefObj[itemOrderRefObj.length - 1];
        const code = itemOrderRefObj[itemOrderRefObj.length - 2];
        const name = itemOrderRefObj[itemOrderRefObj.length - 3];

        const selProdData = this.itemOptionNameList.filter((x:any) => x.value === data.itemType);
        let prodCurrentLocation = <Location>{};
        if (selProdData.length) {
            prodCurrentLocation = selProdData[0].currentLocation;
        }

        // get things for product
        const selProdThingsData = this.things.filter((x:any) => x.productCode === itemOrderRefObj[itemOrderRefObj.length - 2]);
        if (selProdThingsData.length) {
            thingsArr = selProdThingsData[0].things;
        }
        // }
        const products = [...this.order.products];
        this.blankItem = {
            name: name,
            value: data.itemType,
            id: id,
            code: code,
            things: thingsArr,
            deliveryStatus: environment.itemStatus.Open,
            isEditable: true,
            currentLocation: prodCurrentLocation,
            isAlreadySaved: false
        };
        if (this.order.products.indexOf(this.selectedItem) < 0) {
            // new item
            products.push(this.blankItem);
        } else {
            // update existing
            products[this.order.products.indexOf(this.selectedItem)] = this.blankItem;
        }
        this.order.products = products;
        
        if ( !this.showDelete ) {
            this.orderForm.controls.items.reset({
                itemType: '',
                itemValue: '',
            });
        } else {
            this.displayDialog = false;
            this.orderForm.controls.items = this.fb.group({
                'itemType': [''],
                'itemValue': [''],
            });
            this.orderForm.controls.items.patchValue({
                itemType: '',
                itemValue: '',
            });
        }
    }

    /**
     * To close Attribute Dialog
     * @memberof OrderComponent
     */
    closeItemDialog() {
        this.displayDialog = false;
        this.selectedItem = <any>Array;
        this.orderForm.controls.items = this.fb.group({
            'itemType': [''],
            'itemValue': [''],
        });
    }

    /**
     * delete Attribute row
     * @param {*} data
     * @memberof OrderComponent
     */
    deleteItemRow(data:any) {
        data;
        this.order.products = this.order.products.filter(obj => obj !== this.selectedItem);
        this.displayDialog = false;
    }

    /**
     * Call when user start typeing for Tag.
     * @param {string} query
     * @memberof OrderComponent
    */
    onTextChange(query: string) {

        this.globalService.getTagDropdown(query).subscribe((data:any) => {
            this.globalService.prepareOptionList(data.data);
        });
    }

    onTagUpdate(event:any) {
        this.tags = event;
    }

    onDateSelect(elem:any, event:any) {
        if (elem === 'surgery') {
            const expectedCompletionDate = this.orderService.formatDate(moment(event).add(5, 'd'));
            this.orderForm.patchValue({
                expectedCompletionDate: expectedCompletionDate
            });
        }
    }


    /**
     * Load shipment issue comments
     * @param {any} issueId
     *
     * @memberof OrderComponent
     */
    loadComments(issueId:any, hideCommentSection = false) {

        this.loader = true;
        this.displayDialogNotes = true;
        this.comments = [];
        this.noteImages = [];
        this.noteSavedImages = [];
        this.noteRelatedImages = [];
        const self = this;

        if (!hideCommentSection) {
            this.commentAreaFlag = false;
        }

        this.noteItemRequired = false;

        // get shipment items
        const issueShipmentObj = this.issueShipmentMap.filter((x:any) => x.issueId === issueId);
        if (issueShipmentObj) {
            this.shipmentService.get(issueShipmentObj[0].shipmentId).subscribe((data:any) => {
                // build dynamic checkboxes for products
                self.getShipmentProductsForOrder(data.data.products);
                self.getComments(issueId);
                self.loader = false;
            },
               (err:any) => this.showError(err));
        }
    }

    getShipmentProductsForOrder(productsData:any = null) {
        this.savedProducts = [];
        const allSkus: FormArray = new FormArray([]);
        if (productsData !== null) {
            productsData.forEach((productObj:any) => {
                if (productObj.orderDetails.id === this.id) {
                    this.savedProducts.push({
                        id: productObj.id,
                        name: productObj.name
                    });
                }
            });
        }

        if (this.savedProducts.length > 0) {
            // build product checkboxes here
            for (let i = 0; i < this.savedProducts.length; i++) {
                const fg = new FormGroup({});
                fg.addControl(this.savedProducts[i].name + i, new FormControl(false));
                allSkus.push(fg);
            }
            this.orderForm.controls.issue = this.fb.group({
                'shipment': ['', [Validators.required]],
                'comment': ['', [Validators.required]],
                'skus': allSkus
            });
        }

        this.orderForm.controls.issue.reset({
            shipment: this.selectedShipmentForNote,
            comment: ''
        });
    }

    getComments(issueId:any) {
        const self = this;
        // this.comments = [];
        // this.displayDialogNotes = true;
        this.loader = true;
        this.shipmentService.issueComments(issueId).subscribe((data:any) => {
            self.comments = data.data;
            data.data.forEach((comment:any, index:any) => {
                self.comments[index]['showImages'] = [];
                if (comment.images) {
                    comment.images.forEach((commentImage:any) => {
                        if (commentImage.url !== 'dummy') {
                            self.comments[index]['showImages'].push(self.globalService.processImage(commentImage));
                        }
                    });
                }
            })
            self.comments = data.data;
            self.loader = false;
        },(err:any) => this.showError(err));
    }

    /**
     * Load shipment issue comments
     * @param {any} event
     *
     * @memberof OrderComponent
     */
    loadIssueComments(event:any) {
        this.comments = [];
        if (event.value) {
            this.loadComments(event.value);
        }
    }

    showNoteDialog(event:any) {
        event;
        if (this.order.issues.length > 0) {
            this.selectedShipmentForNote = this.order.issues[0].id;
            this.loadComments(this.order.issues[0].id);
        }
        this.displayDialogNotes = true;
    }

    closeNoteDialog() {
        this.displayDialogNotes = false;
        this.loader = false;
    }

    getIssueData() {
        const self = this;
        this.issueList.push({
            label: 'Select Shipment', value: null
        });
        if (this.order.issues.length > 0) {
            this.order.issues.forEach((issue) => {
                self.issueShipmentMap.push({
                    'issueId': issue.id,
                    'shipmentId': issue.shipmentId
                })
                self.issueList.push({
                    label: issue.shipmentCode,
                    value: issue.id
                });
            });
        }
    }

    showCommentArea() {
        this.commentAreaFlag = true;
    }

    hideCommentArea() {
        this.commentAreaFlag = false;
    }

    /**
     * To save shipment note
     * @memberof OrderComponent
     */
    saveNote(value:any) {
        this.noteItemRequired = false;
        const requestProductsArr:any = [];
        value.images = this.noteRelatedImages;
        // value.shippingNo = value.shipment;
        const issueShipmentObj = this.issueShipmentMap.filter((x:any) => x.issueId === value.shipment);
        let issueId = '';
        if (issueShipmentObj) {
            issueId = value.shipment;
            value.shippingNo = issueShipmentObj[0].shipmentId;
        }

        if (value.skus) {
            value.skus.forEach((skuObj:any, index:any) => {
                if (skuObj !== null) {
                    const key = this.savedProducts[index].name + index;
                    if (skuObj.hasOwnProperty(key)) {
                        const sku = skuObj[key];
                        if (sku !== null && sku.length > 0) {
                            requestProductsArr.push(sku[0]);
                        }
                    }
                }
            });
        }

        if (requestProductsArr.length) {
            value.skuIds = requestProductsArr.join(',');
        } else {
            this.noteItemRequired = true;
        }

        if (!this.noteItemRequired) {
            this.shipmentService.createNote(value).subscribe(
               (data:any) => {
                    data;
                    this.msgs = [];
                    this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Note created successfully' });
                    this.loader = false;
                    this.loadComments(issueId, true);
                },
                (error:any) => this.showError(error));
        }
    }

    /**
     * On finalising the upload images of shipment note.
     * @memberof OrderComponent
     */
    onNoteImageListFinalised(event:any) {
        this.noteRelatedImages = event;
    }

    rowStyleClass(rowData:any) {
        // return (rowData.deliveryStatus !== environment.itemStatus.Open) ? 'disabled-row' : '';
        return (!rowData.isEditable) ? 'disabled-row' : '';
    }

}
