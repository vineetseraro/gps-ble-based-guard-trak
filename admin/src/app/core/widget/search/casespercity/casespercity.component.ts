import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-casespercity',
  templateUrl: './casespercity.component.html',
  styleUrls: ['./casespercity.component.css']
})
export class CasespercityComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.globalService.getOrderStatusDropDown();
  dropDown: Dropdown[];
  salesRepUsers: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;
  dateDialog : boolean = false;
  dateDialog1 : boolean = false;
  surgeryDate : boolean = true;
  orderDate : boolean = true;

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
      'city': [''],
      'state': [''],
      'caseNo': [''],
      'status': [''],
      'orderedFrom': [''],
      'orderedTo': [''],
      'surgeryFrom': [''],
      'surgeryTo': [''],
      'salesRepresentative': [''],
      'surgeon': [''],
    });

    this.commonService.getSalesRepUsers('AkSalesRep').subscribe((data:any) => {
      this.salesRepUsers = data;
    });
  }

  searchRecord(searchValue:any) {
    this.surgeryDate = this.globalService.checkDateValidation(searchValue.surgeryFrom, searchValue.surgeryTo);
    this.orderDate = this.globalService.checkDateValidation(searchValue.orderedFrom, searchValue.orderedTo);
    if (!this.surgeryDate || !this.orderDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    if (searchValue.status !== null && searchValue.status !== "")
      query += "&orderStatus=" + searchValue.status;
    if (searchValue.surgeryFrom !== null && searchValue.surgeryFrom !== "")
      query += "&surgeryDateFrom=" + this.globalService.formatDate(searchValue.surgeryFrom);
    if (searchValue.salesRepresentative != null && searchValue.salesRepresentative !== "")
      query += "&salesrep=" + searchValue.salesRepresentative;
    if (searchValue.surgeon !== null && searchValue.surgeon !== "")
      query += "&surgeon=" + searchValue.surgeon;
    if (searchValue.caseNo !== null && searchValue.caseNo !== "")
      query += "&code=" + searchValue.caseNo;
    if (searchValue.city !== null && searchValue.city !== "")
      query += "&city=" + searchValue.city;
    if (searchValue.state !== null && searchValue.state !== "")
      query += "&state=" + searchValue.state;
    if (searchValue.surgeryTo !== null && searchValue.surgeryTo !== "")
      query += "&surgeryDateTo=" + this.globalService.formatDate(searchValue.surgeryTo);
    if (searchValue.orderedFrom !== null && searchValue.orderedFrom !== "")
      query += "&orderedFrom=" + this.globalService.formatDate(searchValue.orderedFrom);
    if (searchValue.orderedTo !== null && searchValue.orderedTo !== "")
      query += "&orderedTo=" + this.globalService.formatDate(searchValue.orderedTo);
    this.commonService.notifyOther({ option: 'casespercity_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'casespercity_search', value: query });
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
