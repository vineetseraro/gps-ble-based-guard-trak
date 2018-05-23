import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Message, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { CountryModel } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { OrderService } from '../../orders/shared/order.service';
import { Attribute as ShipmentAttribute, Item as ShipmentItem, Location, Shipment } from '../shared/shipment.model';
import { ShipmentService } from '../shared/shipment.service';
import { ShipmentStatusPipe } from './../../../core/pipes/shipment-status.pipe';
import { StringUtil } from './../../../core/string.util';
import { AttributesService } from './../../attributes/shared/attributes.service';
import { UserPoolGroupService } from './../../userpools/shared/userpool.service';

@Component({
  selector: 'app-shipment-add',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
  providers: [
    ShipmentService,
    GlobalService,
    AttributesService,
    OrderService,
    ValidationService,
    ShipmentStatusPipe,
    ConfirmationService
  ]
})
export class ShipmentComponent implements OnInit, OnDestroy {
  msgs: Message[] = [];
  shipmentForm: FormGroup;
  data: any;
  private subscription: Subscription;
  title: String = '';
  id: String = '';
  blankItem: ShipmentItem;
  attributeOptionList: SelectItem[];
  attributeOptionNameList: SelectItem[];
  fromAddressList: any;
  toAddressList: any;
  blankAttribute: ShipmentAttribute;
  itemOptionList: any;
  users: SelectItem[];
  itemOptionNameList: any;
  shipment = <Shipment>{};
  tags:any = [];
  loader = false;
  selectedFromAddress: string;
  selectedToAddress: string;
  selectedCarrierUser: string;
  shipmentStatus: string;
  edit = false;
  statusClass: string;
  separator = '<^^>';
  allUsers:any;
  showDelete = false;
  dialogTitleItem: String = '';
  displayDialogAtt = false;
  displayDialog = false;
  dialogTitle: String = '';
  selectedItem: ShipmentItem;
  selectedAttribute: ShipmentAttribute;
  // shipmentOrchestration: ShipmentOrchestration[];
  // totalOrchestrationRecords = 0;
  emptyMessage = '';
  menuItems: any = [];
  deliverDialogTitle = '';
  displayDialogDelivery = false;
  countryModelList: CountryModel[];
  phoneCodeOptionList: SelectItem[] = [];
  relatedImages: Array<any> = [];
  images: Array<any> = [];
  savedImages: Array<any> = [];
  displayDialogShipmentMap = false;
  shipmentStatusLabel = '';
  displayDialogNotes = false;
  comments: Array<any> = [];
  mapInstance: any;
  noteRelatedImages: Array<any> = [];
  noteImages: Array<any> = [];
  noteSavedImages: Array<any> = [];
  savedProducts: Array<any> = [];
  commentAreaFlag = false;
  noteItemRequired = false;
  shipmentId: String = '';
  shipmentSavedItems: any = [];
  productParent = 'shipment';
  misMatchProducts = '';

  /**
     * Constructor Definition
     * @param FormBuilder
     * @param ShipmentService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private userPoolGroupService: UserPoolGroupService,
    private orderService: OrderService,
    private validationService: ValidationService,
    private shipmentStatusPipe: ShipmentStatusPipe,
    private confirmationService: ConfirmationService
  ) {}

  /**
     * Action for close button
     * @memberof ShipmentComponent
     */
  transitionToshipments() {
    this.router.navigate(['/shipments']);
  }

  /**
     * Init function definition
     * @memberof ShipmentComponent
     */
  ngOnInit() {
    this.prepareShipment();
  }

  prepareShipment() {
    this.menuItems = [];
    this.savedImages = [];
    this.relatedImages = [];
    this.images = [];
    this.id = '';
    this.shipmentId = '';
    this.prepareForm();
    this.emptyMessage = StringUtil.emptyMessage;
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.loader = true;
        this.id = params['id'];
        this.shipmentId = this.id;
        this.shipmentService.get(this.id).subscribe(
         (data:any) => {
            this.shipment = data.data;
            this.title = this.shipment.code;
            this.updateShipment();
            this.loader = false;
          },
         (err:any) => this.showError(err)
        );
        this.edit = true;
      } else {
        this.loader = false;
        this.edit = false;
        this.shipment.attributes = [];
        this.shipment.products = [];
        this.title = 'Add Shipment';
        this.menuItems = [
          {
            label: 'SAVE',
            icon: 'fa-plus',
            action: 'open',
            command: (event:any) => {
              this.saveData(event);
            }
          },
          {
            label: 'SCHEDULE PICKUP',
            icon: 'fa-truck',
            action: 'schedule',
            command: (event:any) => {
              this.saveData(event);
            }
          }
        ];
      }
    });
  }

  /**
     * Function for destroying all the components behavior
     * @memberof ShipmentComponent
     */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
     * Fuction for set the form values in edit
     * @memberof ShipmentComponent
     */
  updateShipment() {
    this.shipmentSavedItems = [];
    this.shipmentStatusLabel = this.shipment.shipmentStatusLabel;
    this.savedProducts = [];
    if (this.shipment.products.length) {
      for (let i = 0; i < this.shipment.products.length; i++) {
        if (this.shipment.products[i].orderDetails) {
          this.savedProducts.push({
            id: this.shipment.products[i].id,
            name: this.shipment.products[i].name
          });
          const prodOrderKey =
            this.shipment.products[i].name +
            this.separator +
            this.shipment.products[i].orderDetails.code +
            this.separator +
            this.shipment.products[i].id +
            this.separator +
            this.shipment.products[i].orderDetails.id;
          // this.shipment.products[i].name = prodOrderKey;
          this.shipment.products[i].value = prodOrderKey;
          this.shipment.products[i].isAlreadySaved = true;
          this.shipmentSavedItems.push(this.shipment.products[i]);
        }
      }
    }

    if (this.shipment.shipmentStatus) {
      this.shipmentStatus = this.shipmentStatusPipe.transform(this.shipment.shipmentStatus);
      if (this.shipmentStatus) {
        this.statusClass = this.shipmentStatus.toLowerCase();
      }
    }

    // Edit/ schedule/ reschedule shipment condition
    if (this.shipmentStatus === 'Open' || this.shipmentStatus === 'Scheduled') {
      if (this.shipmentStatus === 'Open') {
        this.menuItems.push({
          label: 'SAVE SHIPMENT',
          icon: 'fa-edit',
          action: 'edit',
          command: (event:any) => {
            this.saveData(event);
          }
        });
      }
      let scheduleStatus = 'schedule';
      if (this.shipmentStatus === 'Scheduled') {
        scheduleStatus = 'reschedule';
      }
      this.menuItems.push({
        label: 'SCHEDULE PICKUP',
        icon: 'fa-truck',
        action: scheduleStatus,
        command: (event:any) => {
          this.saveData(event);
        }
      });
    }

    // Deliver shipment condition
    if (
      this.shipmentStatus === 'Open' ||
      this.shipmentStatus === 'Scheduled' ||
      this.shipmentStatus === 'PartialShipped' ||
      this.shipmentStatus === 'SoftShipped' ||
      this.shipmentStatus === 'Shipped' ||
      this.shipmentStatus === 'PartialDelivered'
    ) {
      this.menuItems.push({
        label: 'DELIVER SHIPMENT',
        icon: 'fa-building-o',
        action: 'deliver',
        command: (event:any) => {
          this.deliverShipment(event);
        }
      });
    }
    // console.log(this.shipmentStatus);
    // proof of delivery condition
    if (this.shipment.deliveryDate && this.shipmentStatus !== 'PartialDelivered') {
      this.menuItems.push({
        label: 'EXPORT PROOF OF DELIVERY',
        icon: 'fa-download',
        command: (event:any) => {
          this.exportProofOfDelivery(event);
        }
      });
    }

    // Shipment map condition
    this.menuItems.push({
      label: 'LOCATION MAP',
      icon: 'fa-map-marker',
      command: (event:any) => {
        this.locationMap(event);
      }
    });

    // Shipment notes condition
    this.menuItems.push({
      label: 'NOTES',
      icon: 'fa-comments-o',
      command: (event:any) => {
        event;
        this.loadComments();
      }
    });

    // Shipment cancel condition
    if (
      // this.shipmentStatus !== 'Delivered' &&
      // this.shipmentStatus !== 'Canceled' &&
      // this.shipmentStatus !== 'PartialDelivered'
      this.shipmentStatus !== 'Closed' &&
      this.shipmentStatus !== 'Canceled'
    ) {
      this.menuItems.push({
        label: 'CANCEL SHIPMENT',
        icon: 'fa-close',
        command: (event:any) => {
          event;
          this.cancelShipmentConfirmBox();
        }
      });
    }

    // get addresses
    let fromAddress = '';
    let toAddress = '';
    if (this.shipment.addresses) {
      this.shipment.addresses.forEach(address => {
        if (address.addressType === 'shipFromAddress') {
          fromAddress = address.location.id;
        } else if (address.addressType === 'shipToAddress') {
          toAddress = address.location.id;
        }
      });
    }
    this.selectedFromAddress = fromAddress;
    this.selectedToAddress = toAddress;

    let carrierUserId = '';
    if (this.shipment.carrierUser) {
      if (this.shipment.carrierUser.hasOwnProperty('uuid')) {
        carrierUserId = this.shipment.carrierUser.uuid;
      }
    }
    this.selectedCarrierUser = carrierUserId;

    let scheduledPickupDate = '';
    if (this.shipment.scheduledPickupDate) {
      scheduledPickupDate = this.shipmentService.formatDate(this.shipment.scheduledPickupDate);
    }
    const etd = this.shipmentService.formatDate(this.shipment.etd);
    this.tags = this.globalService.getTagKeywords(this.shipment.tags);

    this.shipmentForm.reset({
      // name: this.shipment.name,
      code: this.shipment.code,
      tags: this.tags,
      status: this.shipment.status,
      etd: etd,
      scheduledPickupDate: scheduledPickupDate,
      fromAddress: fromAddress,
      toAddress: toAddress,
      // products: this.shipment.products,
      carrierUser: carrierUserId,
      images: []
    });

    if (this.shipmentStatus !== 'Open') {
      this.shipmentForm.controls['etd'].disable();
      this.shipmentForm.controls['fromAddress'].disable();
      this.shipmentForm.controls['toAddress'].disable();

      if (this.shipmentStatus !== 'Scheduled') {
        this.shipmentForm.controls['carrierUser'].disable();
        this.shipmentForm.controls['scheduledPickupDate'].disable();
      }
    }

    // this.getShipmentOrchestration();
  }

  /**
     * Common function to handle order save request
     * @param {any} event
     * @memberof ShipmentComponent
     */
  saveData(event:any) {
    this.clearError();
    const action = event.item.action;
    const shipmentData = this.shipmentForm.value;
    switch (action) {
      case 'open':
        shipmentData.shipmentStatus = environment.shipmentStatus.Open;
        shipmentData.scheduleStatus = '';
        shipmentData.action = 'open';
        break;
      case 'schedule':
        shipmentData.scheduleStatus = 'Y';
        shipmentData.action = 'schedule';
        break;
      case 'reschedule':
        // handle it later
        shipmentData.scheduleStatus = 'Y';
        shipmentData.action = 'reschedule';
        break;
      case 'edit':
        shipmentData.scheduleStatus = '';
        shipmentData.action = 'edit';
        break;
      case 'deliver':
        // this.onSubmit(this.shipmentForm.value);
        break;
    }
    const mismatchLocationFound = this.checkIfProductLocationMismatch(action, shipmentData);

    if (action === 'schedule' || action === 'reschedule') {
      this.validationService.addValidation(this.shipmentForm, 'carrierUser', Validators.required);
      this.validationService.addValidation(
        this.shipmentForm,
        'scheduledPickupDate',
        Validators.required
      );
    } else {
      this.validationService.removeValidation(this.shipmentForm, 'carrierUser');
      this.validationService.removeValidation(this.shipmentForm, 'scheduledPickupDate');
    }

    if (!mismatchLocationFound) {
      this.onSubmit(shipmentData);
    }
  }

  checkIfProductLocationMismatch(action:any, shipmentData:any) {
    this.misMatchProducts = '';
    if (
      action === 'open' ||
      action === 'schedule' ||
      action === 'reschedule' ||
      action === 'edit'
    ) {
      const productsWithLocationMisMatch:any = [];
      if (this.shipment.products && this.shipmentForm.value.fromAddress) {
        this.shipment.products.forEach(product => {
          if (
            !product.isAlreadySaved &&
            product.currentLocation &&
            product.currentLocation.id !== this.shipmentForm.value.fromAddress
          ) {
            productsWithLocationMisMatch.push(product.name);
          }
        });
        if (productsWithLocationMisMatch.length) {
          this.misMatchProducts = 'Product(s) ';
          this.misMatchProducts += '<b>' + productsWithLocationMisMatch.join(', ') + '</b>';
          this.misMatchProducts += ' are not at Ship From Address. Do you still want to continue ?';
          this.productsMismatchLocationConfirmBox(shipmentData);
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

  itemSelected(itemOrderRef:any) {
    if (itemOrderRef != null) {
      const itemOrderRefObj = itemOrderRef.split(this.separator);
      this.shipmentForm.controls.items.patchValue({
        orderNo: itemOrderRefObj[1]
      });
    }
  }

  /**
     * Function for preparing the form
     * @memberof ShipmentComponent
     */
  prepareForm() {
    this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
      this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select Attribute');
      this.attributeOptionNameList = this.globalService.prepareHandlerNameList(data.data);
      this.attributeOptionNameList.unshift({ label: 'Select Attribute', value: null });
    });
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.fromAddressList = this.globalService.prepareDropDown(data.data, 'Select From Address');
      this.toAddressList = this.globalService.prepareDropDown(data.data, 'Select To Address');
    });

    this.phoneCodeOptionList = [{ label: 'Select Country Code', value: null }];
    this.globalService.getCountryPhoneCode().subscribe((data:any) => {
      this.countryModelList = data.data;
      this.countryModelList.forEach(countryCode => {
        this.phoneCodeOptionList.push({
          label: countryCode.dialCode + ' ( ' + countryCode.name + ' ) ',
          value: countryCode.shortCode
        });
      });
    });

    // get items which are assigned in orders
    this.orderService.getAll('/products').subscribe(
     (data:any) => {
        this.itemOptionNameList = [{ value: null, label: 'Select Product' }];
        // this.itemOptionList = [];
        const result = data.data;
        for (let i = 0; i < result.length; i++) {
          // const products = result[i].products;
          for (let j = 0; j < result[i].products.length; j++) {
            const prod = <any>result[i].products[j];
            this.itemOptionNameList.push({
              // product name + this.separator + ordercode + this.separator + prod id + this.separator + order id
              value:
                prod.name +
                this.separator +
                result[i].code +
                this.separator +
                prod.id +
                this.separator +
                result[i].id,
              label: prod.name,
              currentLocation: prod.currentLocation
            });
          }
        }
      },
      (error:any) => {
        this.showError(error);
      }
    );

    this.userPoolGroupService.listUsersInGroup('AkCarrier').subscribe((data:any) => {
      this.allUsers = [];
      for (let i = 0; i < data['Users'].length; i++) {
        const isApproved = data['Users'][i].Attributes.filter(
          (x:any) => x.Name === 'custom:isAdminApproved' && x.Value === 'yes'
        );
        if (isApproved.length) {
          const sub = data['Users'][i].Attributes.filter((x:any) => x.Name === 'sub')[0].Value;
          const fName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'given_name')[0].Value;
          const lName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'family_name')[0].Value;
          const email = data['Users'][i].Attributes.filter((x:any) => x.Name === 'email')[0].Value;
          const mobileObj = data['Users'][i].Attributes.filter(
            (x:any) => x.Name === 'custom:MobileNumber'
          );
          let mobileNo = '';
          if (mobileObj.length) {
            mobileNo = mobileObj[0].Value;
          }
          this.allUsers.push({
            id: sub,
            name: fName + ' ' + lName,
            firstName: fName,
            lastName: lName,
            email: email,
            mobileNo: mobileNo
          });
        }
      }
      this.users = this.globalService.prepareDropDown(this.allUsers, 'Select Carrier User');
    });

    this.shipmentForm = this.fb.group({
      // 'name': ['', [Validators.required]],
      code: ['', [Validators.required, ValidationService.required]],
      fromAddress: ['', [Validators.required]],
      toAddress: ['', [Validators.required]],
      scheduledPickupDate: [''],
      etd: ['', [Validators.required]],
      tags: [this.tags],
      status: [1],
      attributes: this.fb.array([]),
      items: this.fb.array([]),
      carrierUser: ['']
    });

    this.shipmentForm.controls.items = this.fb.group({
      itemName: [''],
      orderNo: ['']
    });

    this.shipmentForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });

    this.shipmentForm.controls.delivery = this.fb.group({
      recipientFirstName: [''],
      recipientLastName: [''],
      recipientMobileNumber: [''],
      recipientMobileCode: [''],
      images: ['']
    });

    this.shipmentForm.controls.issue = this.fb.group({
      comment: ['']
    });
  }

  /**
     * To add Item
     * @memberof ShipmentComponent
     */
  addMoreItem() {
    this.dialogTitleItem = 'Assign Products';
    this.showDelete = false;
    this.displayDialog = true;
    this.shipmentForm.controls.items = this.fb.group({
      itemName: ['', [Validators.required]],
      orderNo: ['']
    });

    this.shipmentForm.controls.items.reset({
      itemName: '',
      orderNo: ''
    });
  }

  onRowSelectItems(event:any) {
    // case: shipment add or shipment open
    if (!this.edit || this.shipment.shipmentStatus === environment.shipmentStatus.Open) {
      this.shipmentForm.controls.items.reset({
        itemName: '',
        orderNo: ''
      });
      this.dialogTitleItem = 'Assign Products';
      this.showDelete = true;
      this.shipmentForm.controls.items = this.fb.group({
        itemName: ['', [Validators.required]],
        orderNo: ['']
      });
      this.shipmentForm.controls.items.patchValue({
        itemName: event.data.value,
        orderNo: event.data.orderDetails.code
      });
      this.displayDialog = true;
    } else {
      this.selectedItem = <any>Array;
    }
  }

  /**
     * To assign items to a shipment
     * @memberof ShipmentComponent
     */
  saveItems(data:any) {
    const itemOrderRefObj = data.itemName.split(this.separator);
    const id = itemOrderRefObj[itemOrderRefObj.length - 2];
    const oCode = itemOrderRefObj[itemOrderRefObj.length - 3];
    const name = itemOrderRefObj[itemOrderRefObj.length - 4];

    const selProdData = this.itemOptionNameList.filter((x:any) => x.value === data.itemName);
    let prodCurrentLocation = <Location>{};
    if (selProdData.length) {
      prodCurrentLocation = selProdData[0].currentLocation;
    }

    const products = [...this.shipment.products];
    this.blankItem = {
      name: name,
      id: id,
      value: data.itemName,
      orderDetails: { id: '', code: oCode },
      deliveryStatus: environment.itemStatus.Open,
      currentLocation: prodCurrentLocation,
      isAlreadySaved: false
    };
    if (this.shipment.products.indexOf(this.selectedItem) < 0) {
      products.push(this.blankItem);
    } else {
      products[this.shipment.products.indexOf(this.selectedItem)] = this.blankItem;
    }
    this.shipment.products = products;

    if ( !this.showDelete ) {
      this.shipmentForm.controls.items.reset({
        itemType: '',
        orderNo: '',
      });
    } else {
      this.displayDialog = false;

      this.shipmentForm.controls.items = this.fb.group({
        itemName: [''],
        orderNo: ['']
      });

      this.shipmentForm.controls.items.patchValue({
        itemName: '',
        orderNo: ''
      });
    }
  }

  /**
     * Calling the edit API
     * @param id
     */
  onEdit(id:any) {
    this.router.navigate(['/shipments', id, 'edit']);
  }

  /**
     * Navgation back
     * @private
     * @memberof ShipmentComponent
     */
  private navigateBack() {
    // this.globalService.goBack();
    this.router.navigate(['/shipments']);
  }

  /**
     * Navgation to details
     * @private
     * Params id
     * @memberof ShipmentComponent
     */
  private navigateToDetails(id = null, action:any) {
    if (id !== null) {
      const self = this;
      this.shipmentId = '';
      if (action === 'edit') {
        setTimeout(function() {
          self.prepareShipment();
        }, 1000);
      } else {
        // add
        setTimeout(function() {
          self.router.navigate(['/shipments', id, 'edit']);
        }, 1000);
      }
    } else {
      this.navigateBack();
    }
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
     * @memberof ShipmentComponent
     */
  onSubmit(value: any) {
    this.clearError();
    // console.log( value );
    if (!this.shipmentForm.valid) {
      this.validationService.validateAllFormFields(this.shipmentForm);
      return false;
    }
    const addArr = [];
    if (value.fromAddress) {
      addArr.push({ addressType: 'shipFromAddress', location: { id: value.fromAddress } });
      // delete value.fromAddress;
    }
    if (value.toAddress) {
      addArr.push({ addressType: 'shipToAddress', location: { id: value.toAddress } });
      // delete value.toAddress;
    }
    value.addresses = addArr;

    value.attributes = [];
    if (typeof this.shipment !== 'undefined') {
      for (const i in this.shipment.attributes) {
        if (this.shipment.attributes[i] !== null) {
          const selAttribute = this.attributeOptionList.filter(
            (x:any) => x.label === this.shipment.attributes[i].name
          );
          if (selAttribute.length > 0) {
            value.attributes.push({
              id: selAttribute[0].value,
              name: this.shipment.attributes[i].name,
              value: this.shipment.attributes[i].value
            });
          }
          // value.attributes.push(this.shipment.attributes[i]);
        }
      }
    }

    value.products = [];
    if (typeof this.itemOptionNameList !== 'undefined') {
      for (const i in this.shipment.products) {
        if (
          this.shipment.products[i] !== null &&
          this.shipment.products[i].name !== 'Select Product'
        ) {
          const selProdData = this.itemOptionNameList.filter(
            (x:any) => x.value === this.shipment.products[i].value
          );
          if (selProdData.length) {
            const prodOrderData = selProdData[0].value.split(this.separator);
            value.products.push({
              id: prodOrderData[prodOrderData.length - 2],
              orderId: prodOrderData[prodOrderData.length - 1]
            });
          }
        }
      }
    }

    let deleteCarrierUser = true;
    if (typeof this.users !== 'undefined') {
      const carUserId = value.carrierUser;
      if (carUserId !== '') {
        const carUserData = this.allUsers.filter((x:any) => x.id === carUserId);
        if (carUserData.length) {
          value.carrierUser = {
            uuid: carUserId,
            firstName: carUserData[0].firstName,
            lastName: carUserData[0].lastName,
            email: carUserData[0].email,
            mobileNo: carUserData[0].mobileNo
          };
          deleteCarrierUser = false;
        }
      }
    }

    if (deleteCarrierUser) {
      // value.carrierUser = { 'uuid': '', 'firstName': '', 'lastName': '', 'email': '', 'mobileNo': '' };
      value.carrierUser = '';
    }

    if (value.etd) {
      value.etd = this.shipmentService.processDate(value.etd);
    }
    if (value.scheduledPickupDate) {
      value.scheduledPickupDate = this.shipmentService.processDate(value.scheduledPickupDate);
    }
    // value.scheduleStatus = 'Y';
    // value.images = this.relatedImages;
    this.loader = true;
    if (this.id === '') {
      this.saveShipment(value);
    } else {
      if (value.action === 'reschedule') {
        value.etd = this.shipment.etd;
        value.addresses = this.shipment.addresses;
      }
      this.editShipment(value);
    }
  }

  /**
     * Schedule Shipment Function
     * @param {any} value
     * @memberof ShipmentComponent
     */
  scheduleShipment(value:any) {
    value.scheduleStatus = 'Y';
    this.onSubmit(value);
  }

  /**
     * Save Shipment Function
     * @param {any} value
     * @memberof ShipmentComponent
     */
  saveShipment(value:any) {
    const self = this;
    this.shipmentService.add(value).subscribe(
     (data:any) => {
        self.msgs = [];
        self.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Shipment created successfully'
        });
        self.data = data.data;
        self.loader = false;
        self.navigateToDetails(self.data.id, 'add');
      },
      (error:any) => this.showError(error)
    );
  }

  /**
     * Edit Shipment Function
     * @param {any} value
     * @memberof ShipmentComponent
     */
  editShipment(value:any) {
    const self:any = this;
    this.shipmentService.update(value, this.id).subscribe(
     (data:any) => {
        self.msgs = [];
        self.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Shipment updated successfully'
        });
        self.data = data;
        self.loader = false;
        self.navigateToDetails(self.id, 'edit');
      },
      (error:any) => this.showError(error)
    );
  }

  /**
     * Show API Error
     * @param {*} error
     * @memberof ShipmentComponent
     */
  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.shipmentForm, error);
  }

  /**
     * clear API Error
     * @memberof ShipmentComponent
     */
  public clearError() {
    this.validationService.clearErrors();
  }

  /**
     * delete Attribute row
     * @param {*} data
     * @memberof ShipmentComponent
     */
  deleteRow(data:any) {
    data;
    this.shipment.attributes = this.shipment.attributes.filter(obj => obj !== this.selectedAttribute);
    this.displayDialogAtt = false;
  }

  /**
     * To save Attribute of location
     * @memberof ShipmentComponent
     */
  saveAttributes(data:any) {
    const attributes = [...this.shipment.attributes];
    if (this.shipment.attributes.indexOf(this.selectedAttribute) < 0) {
      this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue };
      attributes.push(this.blankAttribute);
    } else {
      this.blankAttribute = {
        name: data.attributeType,
        id: data.id,
        value: data.attributeValue
      };
      attributes[this.shipment.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
    }
    this.shipment.attributes = attributes;
    this.displayDialogAtt = false;
    this.shipmentForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
    this.shipmentForm.controls.attributes.patchValue({
      attributeType: '',
      attributeValue: ''
    });
  }

  /**
     * To add Attribute
     * @memberof ShipmentComponent
     */
  addMoreAttribute() {
    this.dialogTitle = 'Add Attribute';
    this.showDelete = false;
    this.displayDialogAtt = true;
    this.shipmentForm.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.shipmentForm.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  onRowSelect(event:any) {
    // case add shipment or ( Shipment status Open or Scheduled )
    if (
      !this.edit ||
      (this.shipment.shipmentStatus === environment.shipmentStatus.Open ||
        this.shipment.shipmentStatus === environment.shipmentStatus.Scheduled)
    ) {
      this.dialogTitle = 'Edit Attribute';
      this.showDelete = true;
      this.shipmentForm.controls.attributes.reset({
        attributeType: '',
        attributeValue: ''
      });
      this.shipmentForm.controls.attributes = this.fb.group({
        attributeType: ['', [Validators.required]],
        attributeValue: ['', [Validators.required]]
      });
      this.shipmentForm.controls.attributes.patchValue({
        attributeType: event.data.name,
        attributeValue: event.data.value
      });
      this.displayDialogAtt = true;
    }
  }

  /**
     * Add tag
     * @param {string} keywords
     * @memberof ShipmentComponent
     */
  onAddTag(keywords: string) {
    this.tags.push(keywords);
  }

  /**
     * Delete tag
     * @param {string} keywords
     * @memberof ShipmentComponent
     */
  onRemoveTag(keywords: string) {
    const index = this.tags.indexOf(keywords);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }

  /**
     * Add item
     * @memberof ShipmentComponent
     */
  addItemRow() {
    const items = [...this.shipment.products];
    this.blankItem = {
      id: 'Select Product',
      name: 'Select Product',
      value: null,
      orderDetails: { id: '', code: '' },
      deliveryStatus: 0,
      currentLocation: <Location>{},
      isAlreadySaved: false
    };
    items.push(this.blankItem);
    this.shipment.products = items;
  }

  /**
     * Call when user start typeing for Tag.
     * @param {string} query
     * @memberof ShipmentComponent
     */
  onTextChange(query: string) {
    this.globalService.getTagDropdown(query).subscribe((data:any) => {
      this.globalService.prepareOptionList(data.data);
    });
  }

  /**
     * To close Product Dialog
     * @memberof ShipmentComponent
     */
  closeItemDialog() {
    this.displayDialog = false;
    this.selectedItem = <any>Array;
    this.shipmentForm.controls.items = this.fb.group({
      itemName: [''],
      orderNo: ['']
    });
  }

  /**
     * delete Attribute row
     * @param {*} data
     * @memberof ShipmentComponent
     */
  deleteItemRow(data:any) {
    data;
    this.shipment.products = this.shipment.products.filter(obj => obj !== this.selectedItem);
    this.displayDialog = false;
  }

  /**
     * To close Attribute Dialog
     * @memberof ShipmentComponent
     */
  closeDialog() {
    this.displayDialogAtt = false;
    this.selectedAttribute = <any>Array;
    this.shipmentForm.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
  }

  /**
     * Function to get shipment Orchestration
     * @memberof ShipmentComponent
     */
  // getShipmentOrchestration() {
  //     this.loader = true;
  //     if (this.id) {
  //         this.shipmentService.getShipmentOrchestration(this.id).subscribe((data:any) => {
  //         const result = data.data;
  //         this.emptyMessage = StringUtil.emptyMessage;
  //         this.totalOrchestrationRecords = data.data.length;
  //         this.shipmentOrchestration = result;
  //         this.totalOrchestrationRecords = data.totalRecords;
  //         this.loader = false;
  //         },
  //         (error:any) => {
  //             this.emptyMessage = StringUtil.emptyMessage;
  //             if (error.code === 210) {
  //                 this.shipmentOrchestration = [];
  //             }
  //             this.loader = false;
  //         });
  //     } else {
  //         this.emptyMessage = StringUtil.emptyMessage;
  //     }
  // }

  /**
     * To deliver shipment
     * @memberof ShipmentComponent
     */
  deliverShipment(event:any) {
    event;
    this.deliverDialogTitle = 'Deliver Shipment';
    this.displayDialogDelivery = true;
    this.images = [];
    this.savedImages = [];
    this.relatedImages = [];
    this.shipmentForm.controls.delivery = this.fb.group({
      recipientFirstName: [''],
      recipientLastName: [''],
      recipientMobileNumber: [''],
      recipientMobileCode: [''],
      images: ['']
    });
    this.shipmentForm.controls.delivery.reset({
      recipientFirstName: '',
      recipientLastName: '',
      recipientMobileNumber: '',
      recipientMobileCode: '',
      images: []
    });
  }

  /**
     * To close delivery Dialog
     * @memberof ShipmentComponent
     */
  closeDeliveryDialog() {
    this.images = [];
    this.savedImages = [];
    this.relatedImages = [];
    this.displayDialogDelivery = false;
    this.shipmentForm.controls.attrideliverybutes = this.fb.group({
      recipientFirstName: [''],
      recipientLastName: [''],
      recipientMobileNumber: [''],
      recipientMobileCode: [''],
      images: ['']
    });
  }

  /**
     * On finalising the upload images of shipment delivery.
     * @memberof ShipmentComponent
     */
  onImageListFinalised(event:any) {
    this.relatedImages = event;
  }

  /**
     * To save delivery
     * @memberof ShipmentComponent
     */
  saveDelivery(value:any) {
    // const images = [];
    this.loader = true;
    const self = this;
    value.images = this.relatedImages;
    this.shipmentService
      .deliver({ deliveryDetails: value, isAdminDelivered: 1 }, this.id)
      .subscribe(
       (data:any) => {
          data;
          self.msgs = [];
          self.msgs.push({
            severity: 'success',
            summary: 'Success',
            detail: 'Shipment delivered successfully'
          });
          self.loader = false;
          self.closeDeliveryDialog();
          self.navigateToDetails(self.id, 'edit');
        },
        (error:any) => this.showError(error)
      );
  }

  locationMap(event:any) {
    event;
    this.displayDialogShipmentMap = true;
  }

  exportProofOfDelivery(event:any) {
    event;
    if (this.shipment.deliveryDetails && this.shipment.deliveryDetails.pdfUrl) {
      window.open(this.shipment.deliveryDetails.pdfUrl);
      return false;
    }
  }

  invalidateMapSize(event:any) {
    event;
    const self = this;
    setTimeout(function() {
      self.mapInstance.map.invalidateSize();
      self.mapInstance.map.fitBounds(self.mapInstance.realTime.getBounds(), { maxZoom: 16 });
    }, 100);
  }

  closeMapDialog() {
    this.displayDialogShipmentMap = false;
  }

  loadComments(params = null, hideCommentSection = false) {
    params;
    this.noteImages = [];
    this.noteSavedImages = [];
    this.noteRelatedImages = [];
    if (!hideCommentSection) {
      this.commentAreaFlag = false;
    }
    this.noteItemRequired = false;

    // const allSkus: FormGroup = new FormGroup({});
    const allSkus: FormArray = new FormArray([]);
    for (let i = 0; i < this.savedProducts.length; i++) {
      const fg = new FormGroup({});
      fg.addControl(this.savedProducts[i].name + i, new FormControl(false));
      allSkus.push(fg);
    }

    this.shipmentForm.controls.issue = this.fb.group({
      comment: ['', [Validators.required]],
      skus: allSkus
    });
    this.shipmentForm.controls.issue.reset({
      comment: ''
    });

    this.displayDialogNotes = true;
    this.loader = true;
    this.shipmentService.issueComments(this.shipment.issue).subscribe(
     (data:any) => {
        this.comments = data.data;
        data.data.forEach((comment:any, index:any) => {
          this.comments[index]['showImages'] = [];
          if (comment.images) {
            comment.images.forEach((commentImage:any) => {
              if (commentImage.url !== 'dummy') {
                this.comments[index]['showImages'].push(
                  this.globalService.processImage(commentImage)
                );
              }
            });
          }
        });
        this.comments = data.data;
        this.loader = false;
      },
     (err:any) => this.showError(err)
    );
  }

  closeNoteDialog() {
    this.displayDialogNotes = false;
    this.shipmentForm.controls.issue = this.fb.group({
      comment: ['']
    });
  }

  onMapLoad(mapInstance:any) {
    // console.log("AAYYYYY");
    this.mapInstance = mapInstance;
  }

  /**
     * To save shipment note
     * @memberof ShipmentComponent
     */
  saveNote(value:any) {
    this.noteItemRequired = false;
    const requestProductsArr:any = [];
    value.images = this.noteRelatedImages;
    value.shippingNo = this.id;
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
          if (data.data.readerReportShippingIssueResponse.issueId) {
            this.shipment.issue = data.data.readerReportShippingIssueResponse.issueId;
            this.shipment.isReported = true;
          }
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Success',
            detail: 'Note created successfully'
          });
          this.loader = false;
          this.loadComments('', true);
        },
        (error:any) => this.showError(error)
      );
    }
  }

  /**
     * On finalising the upload images of shipment note.
     * @memberof ShipmentComponent
     */
  onNoteImageListFinalised(event:any) {
    this.noteRelatedImages = event;
  }

  showCommentArea() {
    this.commentAreaFlag = true;
  }

  hideCommentArea() {
    this.commentAreaFlag = false;
  }

  /**
     * Reset row selection for attributes and items
     * @param {any} type
     * @memberof ShipmentComponent
     */
  dialogHideEvent(type:any) {
    if (type === 'item') {
      this.selectedItem = <any>Array;
      // remove validation
      this.shipmentForm.controls.items = this.fb.group({
        itemName: [''],
        orderNo: ['']
      });
    } else if (type === 'attribute') {
      this.selectedAttribute = <any>Array;
    }
  }

  /**
     * Action to show products mismatch Location with ship from location
     * @memberof ShipmentComponent
     */
  productsMismatchLocationConfirmBox(shipmentData:any) {
    const self = this;
    this.confirmationService.confirm({
      message: this.misMatchProducts,
      header: 'Location Mismatch',
      icon: 'fa fa-question-circle',
      accept: () => {
        self.onSubmit(shipmentData);
      },
      reject: () => {
        //
      }
    });
  }

  /**
     * Action to show Cancel Shipment ConfirmBox
     * @memberof ShipmentComponent
     */
  cancelShipmentConfirmBox() {
    const self = this;
    this.confirmationService.confirm({
      message: 'Shipment will be canceled. Do you still want to continue?',
      header: 'Cancel Shipment',
      icon: 'fa fa-question-circle',
      accept: () => {
        self.cancelShipment(self.id);
      },
      reject: () => {
        //
      }
    });
  }

  /**
     * Params shipment id
     * Cancel Shipment
     * @memberof ShipmentComponent
     */
  cancelShipment(shipmentId:any) {
    this.loader = true;
    const self:any = this;
    this.shipmentService.cancel(shipmentId).subscribe(
     (data:any) => {
        data;
        self.msgs = [];
        self.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Shipment cancelled successfully'
        });
        self.loader = false;
        self.navigateToDetails(self.id, 'edit');
      },
      (error:any) => this.showError(error)
    );
  }

  rowStyleClass(rowData:any) {
    return rowData.deliveryStatus !== environment.itemStatus.Open ? 'disabled-row' : '';
  }
}
