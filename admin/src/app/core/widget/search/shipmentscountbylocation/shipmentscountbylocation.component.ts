import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-shipmentscountbylocation',
  templateUrl: './shipmentscountbylocation.component.html',
  styleUrls: ['./shipmentscountbylocation.component.css']
})
export class ShipmentscountbylocationComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  orderStatus = this.globalService.getOrderStatusDropDown();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;
  dateDialog : boolean = false;
  addressList: any;

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
      this.addressList = this.globalService.prepareDropDown(data.data, 'Select Location');
    });
    this.searchForm = this.fb.group({
      'location': [''],
      'locationType': [''],
      'externalShipmentCount': [''],
      'internalShipmentCount': ['']
    });
   }

  searchRecord(searchValue:any) {
    var query = "";
    if (searchValue.location !== null && searchValue.location !== "")
      query += "&location=" + searchValue.location;
    if (searchValue.externalShipmentCount != null && searchValue.externalShipmentCount !== "")
      query += "&externalCount=" + searchValue.externalShipmentCount;
    if (searchValue.internalShipmentCount != null && searchValue.internalShipmentCount !== "")
      query += "&internalCount=" + searchValue.internalShipmentCount;
    this.commonService.notifyOther({ option: 'shipmentscountbylocation_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'shipmentscountbylocation_search', value: query });
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
