import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';
import { GlobalService } from './../../../global.service';


@Component({
  selector: 'app-search-appstatus',
  templateUrl: './appstatus.component.html',
  styleUrls: ['./appstatus.component.css']
})
export class AppstatusComponent implements OnInit {

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
  dateDialog : boolean = false;

  constructor(
    private globalService: GlobalService,
    private commonService: SearchService,
    private fb: FormBuilder,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.searchForm = this.fb.group({
      // 'bluetooth': [''],
      'gps': [''],
      'beaconService': [''],
      'loggedIn': [''],
      'trackedFrom': [''],
      'trackedTo': [''],
      'active': [''],
      'reporting': [''] 
      
    });

    // this.commonService.getSalesRepUsers('AkSalesRep').subscribe((data:any) => {
    //   this.salesRepUsers = data;
    // });

    /// Get Risk Level /////
    // this.timeLapsed = this.globalService.timeLapsed();
  }
  
  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.trackedFrom, searchValue.trackedTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    if (searchValue.bluetooth !== null && searchValue.bluetooth !== "")
      query += "&btStatus=" + searchValue.bluetooth;
    if (searchValue.trackedFrom !== null && searchValue.trackedFrom !== "")
      query += "&lastTrackedFrom=" + this.globalService.formatDate(searchValue.trackedFrom);
    if (searchValue.gps != null && searchValue.gps !== "")
      query += "&gpsStatus=" + searchValue.gps;
    if (searchValue.beaconService !== null && searchValue.beaconService !== "")
      query += "&beaconServiceStatus=" + searchValue.beaconService;
    if (searchValue.loggedIn !== null && searchValue.loggedIn !== "")
      query += "&isLoggedIn=" + searchValue.loggedIn;
    if (searchValue.active !== null && searchValue.active !== "")
      query += "&isActive=" + searchValue.active;
      if (searchValue.reporting !== null && searchValue.reporting !== "")
      query += "&isReporting=" + searchValue.reporting;
    if (searchValue.trackedTo !== null && searchValue.trackedTo !== "")
      query += "&lastTrackedTo=" + this.globalService.formatDate(searchValue.trackedTo);
    this.commonService.notifyOther({ option: 'appstatus_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'appstatus_search', value: query });
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
  this.dateDialog =false;
  }
  checkDateValidation(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog=true;
    }
  }

  /**
   * Get Order Status from Global Variable 
   * @param {any} lists 
   * @returns 
   * @memberof GlobalService
   */
  getBooleanLable() {
    const lists:any = {
      'All': '',
      'Yes': 1,
      'No': 0,
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
