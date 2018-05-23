import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';


@Component({
  selector: 'app-search-productsordered',
  templateUrl: './productsordered.component.html',
  styleUrls: ['./productsordered.component.css']
})
export class ProductsorderedComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.globalService.getOrderStatusDropDown();
  dropDown: Dropdown[];
  salesRepUsers: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  productList: any;
  categoryList: any;
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
    this.globalService.getDropdown('products' + environment.serverEnv).subscribe((data:any) => {
      this.productList = this.globalService.prepareDropDown(data.data, 'Select Product');
    });
    this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
      this.categoryList = this.globalService.prepareDropDown(data.data, 'Select Category');
    });
    this.searchForm = this.fb.group({
      'orderNo': [''],
      'orderCount': [''],
      'salesRepresentative': [''],
      'product': [''],
      'category': [''],
      'orderedFrom': [''],
      'orderedTo': ['']
    });

    this.commonService.getSalesRepUsers('AkSalesRep').subscribe((data:any) => {
      this.salesRepUsers = data;
    });
  }

  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.orderedFrom, searchValue.orderedTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    console.log(searchValue);
    var query = "";
    if (searchValue.orderCount !== null && searchValue.orderCount !== "")
      query += "&count=" + searchValue.orderCount;
    if (searchValue.orderedFrom !== null && searchValue.orderedFrom !== "")
      query += "&orderedDateFrom=" + this.globalService.formatDate(searchValue.orderedFrom);
    if (searchValue.salesRepresentative != null && searchValue.salesRepresentative !== "")
      query += "&salesrep=" + searchValue.salesRepresentative;
    if (searchValue.product !== null && searchValue.product !== "")
      query += "&product=" + searchValue.product;
    if (searchValue.category !== null && searchValue.category !== "")
      query += "&category=" + searchValue.category;
    if (searchValue.orderNo !== null && searchValue.orderNo !== "")
      query += "&code=" + searchValue.orderNo;
    if (searchValue.orderedTo !== null && searchValue.orderedTo !== "")
      query += "&orderedDateTo=" + this.globalService.formatDate(searchValue.orderedTo);
    console.log(query);
    this.commonService.notifyOther({ option: 'productsordered_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'productsordered_search', value: query });
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
