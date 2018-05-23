import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-productsreadytodispatch',
  templateUrl: './productsreadytodispatch.component.html',
  styleUrls: ['./productsreadytodispatch.component.css']
})
export class ProductsreadytodispatchComponent implements OnInit {

  
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
  dateDialog1 : boolean = false;
  dateDialog2 : boolean = false;
  carrierUsers: SelectItem[];
  surgeryDate : boolean =true;
  pickupDate : boolean =true;
  deliveryDate : boolean =true;
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
      'shipmentNo': [''],
      'shipToAddress' : [''],
      'product': [''],
      'category': [''],
      'surgeryFrom': [''],
      'surgeryTo': [''],
      'pickupFrom': [''],
      'pickupTo': [''],
      'deliveryFrom': [''],
      'deliveryTo': [''],
      'carrierUser': ['']
    });
    this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
      this.carrierUsers = data;
    });
    this.globalService.getDropdown('products' + environment.serverEnv).subscribe((data:any) => {
      this.productList = this.globalService.prepareDropDown(data.data, 'Select Product');
    });
    this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
      this.categoryList = this.globalService.prepareDropDown(data.data, 'Select Category');
    });
    // this.commonService.getSalesRepUsers('AkSalesRep').subscribe((data:any) => {
    //   this.salesRepUsers = data;
    // });
  }

  searchRecord(searchValue:any) {
    console.log(searchValue);
    this.surgeryDate = this.globalService.checkDateValidation(searchValue.surgeryFrom, searchValue.surgeryTo);
    this.pickupDate = this.globalService.checkDateValidation(searchValue.pickupFrom, searchValue.pickupTo);
    this.deliveryDate = this.globalService.checkDateValidation(searchValue.deliveryFrom, searchValue.deliveryTo);
    if (!this.surgeryDate || !this.pickupDate  || !this.deliveryDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    
    if (searchValue.surgeryFrom !== null && searchValue.surgeryFrom !== "")
      query += "&surgeryDateFrom=" + this.globalService.formatDate(searchValue.surgeryFrom);
    if (searchValue.shipmentNo != null && searchValue.shipmentNo !== "")
      query += "&shipmentcode=" + searchValue.shipmentNo;
    if (searchValue.product !== null && searchValue.product !== "")
      query += "&product=" + searchValue.product;
    if (searchValue.category !== null && searchValue.category !== "")
      query += "&category=" + searchValue.category;
    if (searchValue.orderNo !== null && searchValue.orderNo !== "")
      query += "&ordercode=" + searchValue.orderNo;
      if (searchValue.shipToAddress !== null && searchValue.shipToAddress !== "")
      query += "&shipToAddress=" + searchValue.shipToAddress;
    if (searchValue.surgeryTo !== null && searchValue.surgeryTo !== "")
      query += "&surgeryDateTo=" + this.globalService.formatDate(searchValue.surgeryTo);
    if (searchValue.pickupFrom !== null && searchValue.pickupFrom !== "")
      query += "&scheduledPickupDateFrom=" + this.globalService.formatDate(searchValue.pickupFrom);
    if (searchValue.pickupTo !== null && searchValue.pickupTo !== "")
      query += "&scheduledPickupDateTo=" + this.globalService.formatDate(searchValue.pickupTo);
    if (searchValue.deliveryFrom !== null && searchValue.deliveryFrom !== "")
      query += "&scheduledDeliveryDateFrom=" + this.globalService.formatDate(searchValue.deliveryFrom);
    if (searchValue.deliveryTo !== null && searchValue.deliveryTo !== "")
      query += "&scheduledDeliveryDateTo=" + this.globalService.formatDate(searchValue.deliveryTo);
    if (searchValue.carrierUser != null && searchValue.carrierUser !== '')
      query += '&carrier=' + searchValue.carrierUser;
    console.log(query);
    this.commonService.notifyOther({ option: 'productsreadytodispatch_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'productsreadytodispatch_search', value: query });
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
  closeDialog2() {
  this.dateDialog2=false;
  }
  checkDateValidation2(fromDate, toDate, msg) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog2=true;
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
