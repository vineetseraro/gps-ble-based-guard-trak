import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';


@Component({
  selector: 'app-search-shipmentharddelivered',
  templateUrl: './shipmentharddelivered.component.html',
  styleUrls: ['./shipmentharddelivered.component.css']
})
export class ShipmentharddeliveredComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.globalService.getOrderStatusDropDown();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;
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
      'shipmentNo': [''],
      'carrierUser': [''],
      'scheduledFrom': [''],
      'scheduledTo': ['']
    });

    this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
      this.carrierUser = data;
    });
  }

  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.scheduledFrom, searchValue.scheduledTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    if (searchValue.shipmentNo !== null && searchValue.shipmentNo !== "")
      query += "&code=" + searchValue.shipmentNo;
    if (searchValue.scheduledFrom !== null && searchValue.scheduledFrom !== "")
      query += "&deliveryDateFrom=" + this.globalService.formatDate(searchValue.scheduledFrom);
    if (searchValue.carrierUser != null && searchValue.carrierUser !== "")
      query += "&carrier=" + searchValue.carrierUser;
    if (searchValue.scheduledTo !== null && searchValue.scheduledTo !== "")
      query += "&deliveryDateTo=" + this.globalService.formatDate(searchValue.scheduledTo);
    this.commonService.notifyOther({ option: 'shipmentharddelivered_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'shipmentharddelivered_search', value: query });
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
