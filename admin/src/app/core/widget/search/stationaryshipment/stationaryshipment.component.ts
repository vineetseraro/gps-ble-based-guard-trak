import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';


@Component({
  selector: 'app-search-stationaryshipment',
  templateUrl: './stationaryshipment.component.html',
  styleUrls: ['./stationaryshipment.component.css']
})
export class StationaryshipmentComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.getShipmentStatusDropDown();
  dropDown: Dropdown[];
  carrierUsers: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;

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
      'status': [''],
    });

    this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
      this.carrierUsers = data;
    });
  }
 

  searchRecord(searchValue:any) {
    var query = "";
    if (searchValue.shipmentNo !== null && searchValue.shipmentNo !== "")
      query += "&code=" + searchValue.shipmentNo;
    if (searchValue.status !== null && searchValue.status !== "")
      query += "&shipmentStatus=" + searchValue.status;
    console.log(query);
    this.commonService.notifyOther({ option: 'stationaryshipment_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'stationaryshipment_search', value: query });
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
  }

  checkDateValidation(fromDate:any, toDate:any, msg:any) {
    if (fromDate > toDate) {
      alert(msg + " From date should be equal or less than to date");
      toDate = "";
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
      'Scheduled': 20,
      'Partial Shipped': 25,
      'Soft Shipped': 30,
      'In Transit': 40
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
