import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';



@Component({
  selector: 'app-search-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})

export class OrderComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  orderStatus = this.globalService.getOrderStatusDropDown();
  dropDown: Dropdown[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  salesRepUsers: SelectItem[];
  dateFormat:string;
  dateDialog : boolean = false;
   dateDialog1 : boolean = false;
   surgeryDate : boolean =true;
   orderDate : boolean =true;

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
      'orderNo': [''],
      'status': [''],
      'salesRepresentative': [''],
      'surgeryFrom': [''],
      'surgeryTo': [''],
      'orderFrom': [''],
      'orderTo': [''],
    });
    this.commonService.getSalesRepUsers('AkSalesRep').subscribe((data:any) => {
      this.salesRepUsers = data;
    });
  }


  searchRecord(searchValue:any) { 
    this.orderDate = this.globalService.checkDateValidation(searchValue.orderedFrom, searchValue.orderedTo);
    this.surgeryDate = this.globalService.checkDateValidation(searchValue.surgeryFrom, searchValue.surgeryTo);
    
    if (!this.surgeryDate || !this.orderDate) {
      this.dateDialog = true;
      return false;
    }
    let query = '';
    if (searchValue.status !== null && searchValue.status !== '') {
      query += '&orderStatus=' + searchValue.status;
    }
    if (searchValue.salesRepresentative != null && searchValue.salesRepresentative !== '') {
      query += '&consumer=' + searchValue.salesRepresentative;
    }
    if (searchValue.orderNo !== null && searchValue.orderNo !== '') {
      query += '&orderNo=' + searchValue.orderNo;
    }
    if (searchValue.orderFrom !== null && searchValue.orderFrom !== '') {
      query += '&orderedDate=' + this.globalService.formatDate(searchValue.orderFrom);
      if (searchValue.orderTo !== null && searchValue.orderTo !== '') {
        query += '--' + this.globalService.formatDate(searchValue.orderTo);
      }
    }
    if (searchValue.surgeryFrom !== null && searchValue.surgeryFrom !== '') {
      query += '&surgeryDate=' + this.globalService.formatDate(searchValue.surgeryFrom);
      if (searchValue.surgeryTo !== null && searchValue.surgeryTo !== '') {
        query += '--' + this.globalService.formatDate(searchValue.surgeryTo);
      }
    }
    this.commonService.notifyOther({ option: 'order_search', value: query });
    this.closeit('');
  }


  reset() {
    this.searchForm.reset();
    this.globalSearch = '';
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

  searchGlobal() {
    let query = '';
    // if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch.toString();
    // }
    this.commonService.notifyOther({ option: 'order_search', value: query });
    console.log('Here I am = ' + this.globalSearch);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE) {
      if (this.globalSearchFocus) {
        this.searchGlobal();
      } else if (this.isShow) {
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
  open_search() {
    this.isShow = !this.isShow;
  }

}
