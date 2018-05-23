import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';
import { GlobalService } from './../../../global.service';


@Component({
  selector: 'app-search-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  dateFormat: string;
  searchForm: FormGroup; // our model driven form
  booleanLabel = this.getBooleanLable();
  statusLabel = this.getStatusLable();
  dropDown: Dropdown[];
  salesRepUsers: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  timeLapsed: SelectItem[];
  timeZone = '';
  timeFormat = '';
  users: SelectItem[];
  dateDialog : boolean = false;

  constructor(
    private globalService: GlobalService,
    private commonService: SearchService,
    //private userService : UserService,
    private fb: FormBuilder,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.searchForm = this.fb.group({
      'notificationTimeFrom': [''],
      'notificationTimeTo': [''],
      'message': [''],
      'users': [''],
      'type' : ['']
      
    });


    this.globalService.getUserDropdown('users' + environment.serverEnv).subscribe((data:any) => {
      this.users  = this.globalService.prepareUserDropDown(data.data, 'Select User');
    });

    /// Get Risk Level /////
    // this.timeLapsed = this.globalService.timeLapsed();
  }
  
  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.notificationTimeFrom, searchValue.notificationTimeTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    
    var query = "";
    if (searchValue.message)
      query += "&message=" + searchValue.message;
    if (searchValue.notificationTimeFrom)
      query += "&notificationTimeFrom=" + this.globalService.formatDate(searchValue.notificationTimeFrom);
    if (searchValue.type)
      query += "&type=" + searchValue.type;
    if (searchValue.notificationTimeTo)
      query += "&notificationTimeTo=" + this.globalService.formatDate(searchValue.notificationTimeTo);
    if (searchValue.users)
    query += "&actionBy=" + searchValue.users;
    this.commonService.notifyOther({ option: 'appnotifications_search', value: query });
    this.closeit(''); 
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'appnotifications_search', value: query });
    console.log("Here I am = " + this.globalSearch);
  }

  reset() {
    this.searchForm.reset();
    this.globalSearch = null;
    this.searchGlobal();
    this.closeit('');
  }

  closeit(event:any) {
    event;
    this.isShow = false;
    this.closeDialog();
  }

  closeDialog() {
    this.dateDialog = false;
  }


  checkDateValidation(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog = true;
      return false;
    }
    return true;
  }

  /**
   * Get Order Status from Global Variable 
   * @param {any} lists 
   * @returns 
   * @memberof GlobalService
   */
  getBooleanLable() {
    const lists:any = {
      'Select Type': '',
      'GPSBluetoothDown': 'GPSBluetoothDown',
      'OrderCreation': 'OrderCreation',
      'ShipmentSoftDeliveredCR': 'ShipmentSoftDeliveredCR',
      'ShipmentHardDeliveredCR': 'ShipmentHardDeliveredCR',
      'ShipmentPartialDeliveredCR': 'ShipmentPartialDeliveredCR',
      'ShipmentHardShippedCR': 'ShipmentHardShippedCR',
      'ShipmentSoftShippedCR': 'ShipmentSoftShippedCR',
      'ShipmentPartialShippedCR': 'ShipmentPartialShippedCR',
      'ShipmentScheduledCR': 'ShipmentScheduledCR',
      'ShipmentDelayedCR': 'ShipmentDelayedCR',
      'ShipmentSoftDeliveredSR': 'ShipmentSoftDeliveredSR',
      'ShipmentHardDeliveredSR': 'ShipmentHardDeliveredSR',
      'ShipmentHardShippedSR': 'ShipmentHardShippedSR',
      'ShipmentSoftShippedSR': 'ShipmentSoftShippedSR',
      'ShipmentPartialShippedSR': 'ShipmentPartialShippedSR',
      'ShipmentScheduledSR': 'ShipmentScheduledSR',
      'ShipmentDelayedSR': 'ShipmentDelayedSR',
      'CarrierAssignment': 'CarrierAssignment',
      'SurgeryDateChange': 'SurgeryDateChange',
      'OrderAssignedFromSalesRep': 'OrderAssignedFromSalesRep',
      'OrderAssignedToSalesRep': 'OrderAssignedToSalesRep',
      'IssueRespondedSR': 'IssueRespondedSR',
      'IssueCreatedSR': 'IssueCreatedSR',
      'IssueRespondedCR': 'IssueRespondedCR',
      'IssueCreatedCR': 'IssueCreatedCR',
      'BeaconServiceOff': 'BeaconServiceOff'
    };
    let attributes = [];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }
  getStatusLable() {
    const lists:any = {
      'All': '',
      'On': 1,
      'Off': 0,
    };
    let attributes = [];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE) {
      if (this.globalSearchFocus) {
        this.searchGlobal();
      }
      else if (this.isShow) {
        this.searchRecord(this.searchForm.value);
      }
    }
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.closeit('');
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if (!this.eRef.nativeElement.contains(event.target) && !event.target.classList.contains('ng-tns-c9-3')) {
      console.info(event.target.classList, 'classList click - ')

        if(event.target.classList.length === 1) {
          if (!(event.target.classList[0].includes('ng-tns-c'))) {
            this.closeit('');
          }
        }
        if(event.target.classList.length === 2) {
          if (!(event.target.classList[1].includes('ng-tns-c'))) {
            this.closeit('');
          }
        }

        if((!event.target.classList['value']) || event.target.classList[0].includes('my-table')) {
            this.closeit('');
        }

        
    }
  }

  open_search(){
    this.isShow= !this.isShow;
  }
 
}
