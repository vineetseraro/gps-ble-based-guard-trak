import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { ConfirmationService, Message } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { Notification } from '../shared/notification.model';
import { NotificationService } from '../shared/notification.service';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';
import { UserPoolGroupService } from './../../userpools/shared/userpool.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
  providers: [NotificationService, GlobalService, ValidationService, ConfirmationService]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild('dt') public dataTable: DataTable;
  dataList: Notification[];
  dataRow: Notification;
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
  selectedNotifications: string[] = [];
  menuItems: any = [];
  shipmentForm: FormGroup;
  allUsers:any;
  users: SelectItem[];
  displayAssignCarrierDialog = false;
  displayAssignPickUpDateDialog = false;
  notificationAction = 'Archive Notifications';
  noNotificationsSelected = false;
  msgs: Message[] = [];
  eventObj: any;
  allNotificationsSelDeselect = false;
  totalRecordsForAction = 0;
  private subscription: Subscription;
  globalFilters: any;
  currentQuery: string;
  searchQuery = '';
  displayExport = false;
  exportMessage = '';

  /**
   * Creates an instance of NotificationListComponent.
   * @param {NotificationService} notificationService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof NotificationListComponent
   */
  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private userPoolGroupService: UserPoolGroupService,
    private confirmationService: ConfirmationService,
    private searchService: SearchService
  ) {}

  /**
   * Init Method
   * @memberof NotificationListComponent
   */
  public ngOnInit() {
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'appnotifications_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);        
        this.getNotificationList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });

    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();

    

    this.heightCalc();
  }

  ngOnDestroy() {
    if ( this.subscription ) {
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
   * Function for opening the Notification Add Form
   * @memberof NotificationListComponent
   */
  public addData() {
    this.router.navigate(['shipments/add']);
  }

  /**
   * Notification Edit Function
   * @param {Notification} dataRow
   * @memberof NotificationListComponent
   */
  public onEdit(dataRow: Notification) {
    var redirectModule, redirectModuleId;

    if(dataRow.type.indexOf('Shipment') !== -1 || dataRow.type.indexOf('Issue') !== -1) {
      redirectModule = 'shipments';
      redirectModuleId = dataRow.params.shipmentId
      this.router.navigate([redirectModule+'/'+redirectModuleId+'/edit']);
    } else if (dataRow.type.indexOf('Order') !== -1) {
      redirectModule = 'orders';
      redirectModuleId = dataRow.params.orderId
      this.router.navigate([redirectModule+'/'+redirectModuleId+'/edit']);
    } else if (dataRow.type.indexOf('GPS') !== -1 || dataRow.type.indexOf('Bluetooth') !== -1) {
      redirectModule = 'reports/appstatus';
      this.router.navigate([redirectModule]);
    }
    
  }

  /**
   * Load the Notification Data
   * @param {LazyLoadEvent} event
   * @memberof NotificationListComponent
   */
  loadData(event: LazyLoadEvent) {
    this.eventObj = event;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getNotificationList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Notification Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getNotificationList(query: string) {
    // reset checkboxes here
    this.resetCheckBoxSelection();
    this.loader = true;
    this.notificationService.getAll(query).subscribe(
     (data:any) => {
        const result = data.data;
        this.totalRecords = data.totalRecords;
        this.setPageinationgMessage(data.data.length);
        this.emptyMessage = StringUtil.emptyMessage;
        

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

  
  selectNotification(event:any) {
    event;
    if (this.totalRecordsForAction === this.selectedNotifications.length) {
      this.allNotificationsSelDeselect = true;
    } else {
      this.allNotificationsSelDeselect = false;
    }
  }

  
  
  selectDeselectAllNotifications(event:any) {
    if (event === true) {
      this.allNotificationsSelDeselect = true;
      const notifications:any = [];
      this.dataList.forEach(row => {
        //if (row.shipmentStatus === 10) {
          notifications.push(row.id);
        //}
      });
      this.selectedNotifications = notifications;
    } else {
      this.resetCheckBoxSelection();
    }
  }

  resetCheckBoxSelection() {
    this.allNotificationsSelDeselect = false;
    this.selectedNotifications = [];
  }

  setTotalRecordsForAction() {
    const self = this;
    this.totalRecordsForAction = 0;
    // set total records for action
    if (this.dataList) {
      this.dataList.forEach(row => {
        row;
        //if (row.shipmentStatus === 10) {
          self.totalRecordsForAction++;
        //}
      });
    }
  }


  confirmationArchiveNotifications() {
    const self = this;
    
    let archiveMessage = 'Selected notifications will be archived. Do you still want to continue ?'
    if ( this.selectedNotifications.length === 0) {
      archiveMessage = 'Please select at least one notification to archive.'
    }
    this.confirmationService.confirm({
      message: archiveMessage,
      header: this.notificationAction,
      icon: 'fa fa-question-circle',
      accept: () => {
        self.archiveNotifications({}, 'cancel');
      },
      reject: () => {
        //
      }
    });
  }

  archiveNotifications(value:any, action:any) {
    value;
    action;
    if ( this.selectedNotifications.length ) {
      let request = {'notificationIdList': this.selectedNotifications, 'archiveAll': false};
      this.notificationService.archive(request).subscribe(
        (data:any) => {
          data;
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Success',
            detail: 'Notification(s) archieved successfully'
          });
          this.getNotificationList(this.currentQuery);
        }
      );
    }
  }

  /**
     * clear API Error
     * @memberof NotificationComponent
     */
  public clearError() {
    this.validationService.clearErrors();
  }
  /**
   * Show API Error
   * @param {*} error
   * @memberof NotificationComponent
   */
  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.shipmentForm, error);
  }

  closeNotificationRequiredDialog() {
    this.noNotificationsSelected = false;
  }

  /**
   * Refresh Notification List
   * @private
   * @memberof NotificationListComponent
   */
  refreshList(action:any) {
    // bulk action success
    const self = this;
    // if ( this.globalFilters ) {
    //   this.dataTableComponent.filters = this.globalFilters;
    // }
    this.currentQuery = this.globalService.prepareQuery(this.eventObj) + this.searchQuery;
    this.getNotificationList(this.currentQuery);

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
      let format = 'csv', entity = 'notifications';
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
