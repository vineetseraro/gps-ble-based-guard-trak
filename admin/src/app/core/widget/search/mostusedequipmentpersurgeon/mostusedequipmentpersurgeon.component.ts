import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-search-mostusedequipmentpersurgeon',
  templateUrl: './mostusedequipmentpersurgeon.component.html',
  styleUrls: ['./mostusedequipmentpersurgeon.component.css']
})
export class MostusedequipmentpersurgeonComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
   addressList: any;
   zoneList:any;
   floorList:any;
   public isShow:boolean = false;
   globalSearch:string;
   public globalSearchFocus: boolean = false;
   loader = false;
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
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.addressList = this.globalService.prepareDropDown(data.data, 'Select Locaction');
    });
    
    this.searchForm = this.fb.group({
      'surgeon': [''],
      'product': [''],
      'category': [''],
      'SKU': [''],
      'usageCount': [''],
      'surgery': [''],
      'hospital': ['']
    });

    // this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
    //   this.carrierUsers = data;
    // });
  }
    closeit(event:any) {
      event;
    this.isShow = false;
  }


  searchRecord(searchValue:any) {
    var query = "";
    if (searchValue.surgeon != null && searchValue.surgeon != "")
      query += "&surgeon=" + searchValue.surgeon;
    if (searchValue.product != null && searchValue.product != "")
      query += "&product=" + searchValue.product;
    if (searchValue.category != null && searchValue.category != "")
      query += "&category=" + searchValue.category;
    if (searchValue.SKU != null && searchValue.SKU != "")
      query += "&sku=" + searchValue.SKU;
    if (searchValue.usageCount != null && searchValue.usageCount != "")
      query += "&count=" + searchValue.usageCount;
    if (searchValue.surgery != null && searchValue.surgery != "")
      query += "&surgery=" + searchValue.surgery;
    if (searchValue.hospital != null && searchValue.hospital != "")
      query += "&hospital=" + searchValue.hospital;
    this.commonService.notifyOther({ option: 'mostusedequipmentpersurgeon_search', value: query });
    this.closeit('');
  }

  

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'mostusedequipmentpersurgeon_search', value: query });
  }

  reset() {
    this.searchForm.reset();
    this.globalSearch = null;
    this.searchRecord('');
    this.closeit('');
  }


  /**
   * Get Shipment Status Dropdown 
   * @param {any} lists 
   * @returns 
   * @memberof GlobalService
   */


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