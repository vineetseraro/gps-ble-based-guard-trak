import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';


@Component({
  selector: 'app-search-diagnpointlocationtracking',
  templateUrl: './diagn_pointlocationtracking.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
})

export class DiagnPointLocationTrackingComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  pointStatuses: any;
  discardTypes: any;
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateDialog : boolean = false;
  dateDialog1 : boolean = false;
  trackedDate : boolean =true;
  updatedDate : boolean =true;

  constructor(
    private commonService: SearchService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private eRef: ElementRef

  ) {
    this.pointStatuses = this.globalService.getPointStatusDropDown();
    this.discardTypes = this.globalService.getDiscardReasonDropDown();
  }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();

    this.searchForm = this.fb.group({
      'pointStatus': [''],
      'sensorsCode': [''],
      'pkid': [''],
      'discardType': [''],
      'device': [''],
      'trackedFrom': [''],
      'trackedTo': [''],
      'updatedFrom': [''],
      'updatedTo': [''],
    });
  }

  searchRecord(searchValue:any) {
    this.trackedDate = this.globalService.checkDateValidation(searchValue.trackedFrom, searchValue.trackedTo);
    this.updatedDate = this.globalService.checkDateValidation(searchValue.updatedFrom, searchValue.updatedTo);
    if (!this.trackedDate || !this.updatedDate) {
      this.dateDialog = true;
      return false;
    }

    var query = "";
    if (searchValue.device !== null && searchValue.device !== "")
      query += "&deviceCode=" + searchValue.device;
    if (searchValue.pointStatus != null && searchValue.pointStatus !== "")
      query += "&discarded=" + searchValue.pointStatus;
    if (searchValue.discardType !== null && searchValue.discardType !== "")
      query += "&discardType=" + searchValue.discardType;
    if (searchValue.sensorsCode !== null && searchValue.sensorsCode !== "")
      query += "&sensors_code=" + searchValue.sensorsCode;
    if (searchValue.pkid !== null && searchValue.pkid !== "")
      query += "&pkid=" + searchValue.pkid;
    if (searchValue.trackedFrom !== null && searchValue.trackedFrom !== "")
      query += "&trackedFrom=" + this.globalService.formatDate(searchValue.trackedFrom);
    if (searchValue.trackedTo !== null && searchValue.trackedTo !== "")
      query += "&trackedTo=" + this.globalService.formatDate(searchValue.trackedTo);
    if (searchValue.updatedFrom !== null && searchValue.updatedFrom !== "")
      query += "&updatedFrom=" + this.globalService.formatDate(searchValue.updatedFrom);
    if (searchValue.updatedTo !== null && searchValue.updatedTo !== "")
      query += "&updatedTo=" + this.globalService.formatDate(searchValue.updatedTo);
    this.commonService.notifyOther({ option: 'diagnpointlocationtracking_search', value: query });
    this.closeit('');

  }
  searchGlobal() {
    var query = "";

    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'diagnpointlocationtracking_search', value: query });
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
   closeDialog1() {
  this.dateDialog1 =false;
  }
  checkDateValidation1(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog1=true;
    }
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
    console.log(this.eRef.nativeElement);
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
  open_search() {
    this.isShow = !this.isShow;
  }


}
