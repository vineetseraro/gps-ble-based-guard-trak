import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';


@Component({
  selector: 'app-search-itemsnotdelivered',
  templateUrl: './itemsnotdelivered.component.html',
  styleUrls: ['./itemsnotdelivered.component.css']
})
export class ItemsnotdeliveredComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.getShipmentStatusDropDown();
  dropDown: Dropdown[];
  public isShow:boolean = false;
  globalSearch:string;
  addressList:any;
  carrierUser: SelectItem[];
  public globalSearchFocus: boolean = false;
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
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.addressList = this.globalService.prepareDropDown(data.data, 'Select Hospital');
    });
    this.searchForm = this.fb.group({
      'sku': [''],
      'product': [''],
      'shipmentNo': [''],
      'status': [''],
      'shipToAddress': [''],
      'currentLocation': [''],
      'carrierUser': [''],
      'shippedFrom': [''],
      'shippedTo': ['']
    });

    this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
      this.carrierUser = data;
    });
  }

  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.shippedFrom, searchValue.shippedTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    if (searchValue.status !== null && searchValue.status !== "")
      query += "&shipmentStatus=" + searchValue.status;
    if (searchValue.shippedFrom !== null && searchValue.shippedFrom !== "")
      query += "&shippedDateFrom=" + this.globalService.formatDate(searchValue.shippedFrom);
    if (searchValue.currentLocation != null && searchValue.currentLocation !== "")
      query += "&currentLocation=" + searchValue.currentLocation;
    if (searchValue.sku != null && searchValue.sku !== "")
      query += "&productCode=" + searchValue.sku;
    if (searchValue.product != null && searchValue.product !== "")
      query += "&productName=" + searchValue.product;
    if (searchValue.shipToAddress != null && searchValue.shipToAddress !== "")
      query += "&toAddress=" + searchValue.shipToAddress;
    if (searchValue.carrierUser !== null && searchValue.carrierUser !== "")
      query += "&carrier=" + searchValue.carrierUser;
    if (searchValue.shipmentNo !== null && searchValue.shipmentNo !== "")
      query += "&code=" + searchValue.shipmentNo;
    if (searchValue.shippedTo !== null && searchValue.shippedTo !== "")
      query += "&shippedDateTo=" + this.globalService.formatDate(searchValue.shippedTo);
    this.commonService.notifyOther({ option: 'casespersurgery_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'casespersurgery_search', value: query });
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
   * Get Shipment Status Dropdown 
   * @param {any} lists 
   * @returns 
   * @memberof GlobalService
   */
  getShipmentStatusDropDown() {
    const lists:any = {
        'Open' : 10,
        'Scheduled' : 20,
        'Partial Shipped' : 25,
        'Soft Shipped' : 30,
        'In Transit': 40,
        'Partial Delivered': 45,
    };

    let attributes = [{ label: 'Select Shipment Status', value: null }];
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
