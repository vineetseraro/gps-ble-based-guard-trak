import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { ConfirmationService, Message } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { Shipment } from '../shared/shipment.model';
import { ShipmentService } from '../shared/shipment.service';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';
import { UserPoolGroupService } from './../../userpools/shared/userpool.service';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css'],
  providers: [ShipmentService, GlobalService, ValidationService, ConfirmationService]
})
export class ShipmentListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  dataList: Shipment[];
  dataRow: Shipment;
  display = false;
  id = '';
  title = '';
  totalRecords = 0;
  activeStatus: SelectItem[];
  previousQuery: string;
  items: MenuItem[];
  loader = false;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  rows:any = '';
  emptyMessage = '';
  innerHeight: any;
  selectedShipments: string[] = [];
  menuItems: any = [];
  shipmentForm: FormGroup;
  allUsers:any;
  users: SelectItem[];
  displayAssignCarrierDialog = false;
  displayAssignPickUpDateDialog = false;
  shipmentAction = '';
  noShipmentsSelected = false;
  msgs: Message[] = [];
  eventObj: any;
  allShipmentsSelDeselect = false;
  totalRecordsForAction = 0;
  private subscription: Subscription;
  globalFilters: any;
  currentQuery: string;
  searchQuery = '';
  displayExport = false;
  exportMessage = '';

  /**
   * Creates an instance of ShipmentListComponent.
   * @param {ShipmentService} shipmentService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof ShipmentListComponent
   */
  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private userPoolGroupService: UserPoolGroupService,
    private confirmationService: ConfirmationService,
    private searchService: SearchService
  ) {}

  /**
   * Init Method
   * @memberof ShipmentListComponent
   */
  public ngOnInit() {
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'shipment_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);        
        this.getShipmentList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        // console.log(this.searchQuery);
        this.startPageIndex = 1;
        this.dataTableComponent.onFilterKeyup('', '', 'Contains');
      }
    });

    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();

    this.menuItems = [
      {
        label: 'ASSIGN CARRIER',
        icon: 'fa-user-plus',
        action: 'assign-carrier',
        command: (event:any) => {
          this.action(event);
        }
      },
      {
        label: 'ASSIGN PICKUP DATE',
        icon: 'fa-calendar',
        action: 'assign-pickupdate',
        command: (event:any) => {
          this.action(event);
        }
      },
      {
        label: 'SCHEDULE PICKUP',
        icon: 'fa-truck',
        action: 'schedule-pickup',
        command: (event:any) => {
          this.action(event);
        }
      },
      {
        label: 'CANCEL SHIPMENTS',
        icon: 'fa-close',
        action: 'cancel',
        command: (event:any) => {
          this.action(event);
        }
      }
    ];

    this.heightCalc();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    this.innerHeight = this.innerHeight - 400 + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.innerHeight = event.target.innerHeight - 290 + 'px';
  }

  /**
   * Function for opening the Shipment Add Form
   * @memberof ShipmentListComponent
   */
  public addData() {
    this.router.navigate(['shipments/add']);
  }

  /**
   * Shipment Edit Function
   * @param {Shipment} dataRow
   * @memberof ShipmentListComponent
   */
  public onEdit(dataRow: Shipment) {
    this.router.navigate([dataRow.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Load the Shipment Data
   * @param {LazyLoadEvent} event
   * @memberof ShipmentListComponent
   */
  loadData(event: LazyLoadEvent) {
    this.eventObj = event;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getShipmentList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Shipment Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getShipmentList(query: string) {
    // reset checkboxes here
    this.resetCheckBoxSelection();
    this.loader = true;
    this.shipmentService.getAll(query).subscribe(
     (data:any) => {
        const result = data.data;
        this.totalRecords = data.totalRecords;
        this.setPageinationgMessage(data.data.length);
        this.emptyMessage = StringUtil.emptyMessage;
        for (let i = 0; i < result.length; i++) {
          result[i].fromAddress = '';
          result[i].toAddress = '';
          const addArr = result[i].addresses;
          for (let j = 0; j < addArr.length; j++) {
            if (addArr[j].addressType === 'shipFromAddress') {
              result[i].fromAddress = addArr[j].location.name;
            } else if (addArr[j].addressType === 'shipToAddress') {
              result[i].toAddress = addArr[j].location.name;
            }
          }
          // carrierUser
          result[i].carrierUserName = '';
          if (result[i].carrierUser) {
            if (result[i].carrierUser.firstName) {
              result[i].carrierUserName += result[i].carrierUser.firstName;
            }
            if (result[i].carrierUser.lastName) {
              result[i].carrierUserName += ' ' + result[i].carrierUser.lastName;
            }
          }
        }

        this.dataList = result;
        this.totalRecords = data.totalRecords;
        this.setTotalRecordsForAction();
        this.loader = false;
      },
      (error:any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.resetPaginationMessage();
        }
        this.loader = false;
      }
    );
  }

  resetPaginationMessage() {
    this.totalRecords = 0;
    this.totalRecordsForAction = 0;
    this.startPageIndex = 0;
    this.setPageinationgMessage(1);
  }

  setPageinationgMessage(listSize: number) {
    this.endPageIndex = listSize + this.startPageIndex - 1;
    this.pagingmessage =
      'Showing ' +
      this.startPageIndex +
      ' to ' +
      this.endPageIndex +
      ' of ' +
      this.totalRecords +
      ' entries';
  }

  loadComments(params:any) {
    params;
    //
  }

  /**
   * Common function to handle bulk shipments request
   * @param {any} event
   * @memberof ShipmentListComponent
   */
  action(event:any) {
    this.prepareForm();
    const action = event.item.action;
    // set title here
    switch (action) {
      case 'assign-carrier':
        this.shipmentAction = 'Assign Carrier';
        break;
      case 'assign-pickupdate':
        this.shipmentAction = 'Assign Pickup Date';
        break;
      case 'schedule-pickup':
        this.shipmentAction = 'Schedule Shipment(s)';
        break;
      case 'cancel':
        this.shipmentAction = 'Cancel Shipment(s)';
        break;
    }
    // check if shipments are selected
    if (!this.selectedShipments.length) {
      this.noShipmentsSelected = true;
      return;
    }
    switch (action) {
      case 'assign-carrier':
        this.showAssignCarrierDialog();
        break;
      case 'assign-pickupdate':
        this.showAssignPickupDateDialog();
        break;
      case 'schedule-pickup':
        this.showSchedulePickUpConfirmBox();
        break;
      case 'cancel':
        this.cancelShipmentsConfirmBox();
        break;
    }
  }

  /**
   * Common function to save bulk shipments request
   * @param {any} value, action
   * @memberof ShipmentListComponent
   */
  saveShipments(value:any, action:any) {
    value.shipmentIds = this.selectedShipments;
    switch (action) {
      case 'assign-carrier':
        value.actionType = 'assign carrier';
        this.assignCarrier(value, action);
        break;
      case 'assign-pickupdate':
        value.actionType = 'assign pickupdate';
        this.assignPickupCarrier(value, action);
        break;
      case 'schedule-pickup':
        value.actionType = 'schedule';
        this.schedulePickup(value, action);
        break;
      case 'cancel':
        value.actionType = 'cancel';
        this.cancelShipments(value, action);
        break;
    }
  }

  assignCarrier(value:any, action:any) {
    let carrierUserFound = false;
    if (typeof this.users !== 'undefined') {
      const carUserId = value.carrierUser;
      if (carUserId !== '') {
        const carUserData = this.allUsers.filter((x:any) => x.id === carUserId);
        if (carUserData.length) {
          value.carrier = {
            uuid: carUserId,
            firstName: carUserData[0].firstName,
            lastName: carUserData[0].lastName,
            email: carUserData[0].email,
            mobileNo: carUserData[0].mobileNo
          };
          carrierUserFound = true;
        }
      }
    }

    if (carrierUserFound) {
      this.bulkAction(value, action);
    }
  }

  assignPickupCarrier(value:any, action:any) {
    value.pickupDate = '';
    if (value.scheduledPickupDate) {
      value.pickupDate = this.shipmentService.processDate(value.scheduledPickupDate);
    }

    if (value.pickupDate) {
      this.bulkAction(value, action);
    }
  }

  schedulePickup(value:any, action:any) {
    this.bulkAction(value, action);
  }

  cancelShipments(value:any, action:any) {
    this.bulkAction(value, action);
  }

  /**
   * Bulk Shipments Function
   * @param {any} value
   * @memberof ShipmentListComponent
   */
  bulkAction(value:any, action:any) {
    this.clearError();
    this.loader = true;
    const self = this;
    this.shipmentService.bulkAction(value).subscribe(
     (data:any) => {
        data;
        self.msgs = [];
        self.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Shipment(s) updated successfully'
        });
        self.loader = false;
        self.refreshList(action);
      },
      (error:any) => {
        this.showError(error);
        self.refreshList(action);
      }
    );
  }

  prepareForm() {
    this.shipmentForm = this.fb.group({});
    this.shipmentForm.controls.carrier = this.fb.group({
      carrierUser: ['']
    });
    this.shipmentForm.controls.pickupdate = this.fb.group({
      scheduledPickupDate: ['']
    });
  }

  getCarrierUsers() {
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
  }

  showAssignCarrierDialog() {
    this.displayAssignCarrierDialog = true;
    this.getCarrierUsers();
    this.shipmentForm.controls.carrier = this.fb.group({
      carrierUser: ['', [Validators.required]]
    });
  }

  closeCarrierDialog() {
    this.displayAssignCarrierDialog = false;
    this.shipmentForm.controls.carrier = this.fb.group({
      carrierUser: ['']
    });
  }

  showAssignPickupDateDialog() {
    this.displayAssignPickUpDateDialog = true;
    this.shipmentForm.controls.pickupdate = this.fb.group({
      scheduledPickupDate: ['', [Validators.required]]
    });
  }

  closePickupDateDialog() {
    this.displayAssignPickUpDateDialog = false;
    this.shipmentForm.controls.pickupdate = this.fb.group({
      scheduledPickupDate: ['']
    });
  }

  showSchedulePickUpConfirmBox() {
    const self = this;
    this.confirmationService.confirm({
      message: 'Selected shipments will be scheduled. Do you still want to continue ?',
      header: this.shipmentAction,
      icon: 'fa fa-question-circle',
      accept: () => {
        self.saveShipments({}, 'schedule-pickup');
      },
      reject: () => {
        //
      }
    });
  }

  cancelShipmentsConfirmBox() {
    const self = this;
    this.confirmationService.confirm({
      message: 'Selected shipments will be cancelled. Do you still want to continue ?',
      header: this.shipmentAction,
      icon: 'fa fa-question-circle',
      accept: () => {
        self.saveShipments({}, 'cancel');
      },
      reject: () => {
        //
      }
    });
  }

  selectShipment(event:any) {
    event;
    if (this.totalRecordsForAction === this.selectedShipments.length) {
      this.allShipmentsSelDeselect = true;
    } else {
      this.allShipmentsSelDeselect = false;
    }
  }

  selectDeselectAllShipments(event:any) {
    if (event === true) {
      this.allShipmentsSelDeselect = true;
      const shipments:any = [];
      this.dataList.forEach(row => {
        if (row.shipmentStatus === 10) {
          shipments.push(row.id);
        }
      });
      this.selectedShipments = shipments;
    } else {
      this.resetCheckBoxSelection();
    }
  }

  resetCheckBoxSelection() {
    this.allShipmentsSelDeselect = false;
    this.selectedShipments = [];
  }

  setTotalRecordsForAction() {
    const self = this;
    this.totalRecordsForAction = 0;
    // set total records for action
    if (this.dataList) {
      this.dataList.forEach(row => {
        if (row.shipmentStatus === 10) {
          self.totalRecordsForAction++;
        }
      });
    }
  }

  /**
     * clear API Error
     * @memberof ShipmentComponent
     */
  public clearError() {
    this.validationService.clearErrors();
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

  closeShipmentRequiredDialog() {
    this.noShipmentsSelected = false;
  }

  /**
   * Refresh Shipment List
   * @private
   * @memberof ShipmentListComponent
   */
  refreshList(action:any) {
    // bulk action success
    const self = this;
    // if ( this.globalFilters ) {
    //   this.dataTableComponent.filters = this.globalFilters;
    // }
    this.currentQuery = this.globalService.prepareQuery(this.eventObj) + this.searchQuery;
    this.getShipmentList(this.currentQuery);

    this.dataTableComponent.onFilterKeyup('', '', 'Contains');
    setTimeout(function() {
      switch (action) {
        case 'assign-carrier':
          self.closeCarrierDialog();
          break;
        case 'assign-pickupdate':
          self.closePickupDateDialog();
          break;
        case 'schedule-pickup':
          // do some thing on schedule success
          break;
      }
    }, 500);
  }

    /**
   * Function for exporting the records
   * @memberof ProductListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if ( this.totalRecords > 0) {
      let format = 'csv', entity = 'shipments';
      let queryObject = this.globalService.queryStringToObject(this.currentQuery);
      
      this.globalService.export(format, entity, queryObject).subscribe(
       (data:any) => {
          console.log(data);
          self.exportStatus(data.description);
        },
        (error:any) => {
          console.log(error);
          self.exportStatus(error.description);
        }
      );
    } else {
      statusMessage = 'No records to export';
      self.exportStatus(statusMessage)
    }
  }

  exportStatus(statusMessage:any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }
}
