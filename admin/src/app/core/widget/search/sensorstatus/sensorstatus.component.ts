import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-sensorstatus',
  templateUrl: './sensorstatus.component.html',
  styleUrls: ['./sensorstatus.component.css']
})
export class SensorstatusComponent implements OnInit {

 searchForm: FormGroup; // our model driven form
  assigned = this.getBooleanLable();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
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
      'name': [''],
      'sku': [''],
      'assigned': [''],
      'manufacturer': ['']
    });

    this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
      this.carrierUser = data;
    });
  }
 

  searchRecord(searchValue:any) {
    var query = "";
    if (searchValue.name !== null && searchValue.name !== "")
      query += "&sensor=" + searchValue.name;
    if (searchValue.sku !== null && searchValue.sku !== "")
      query += "&sku=" + searchValue.sku;
    if (searchValue.assigned != null && searchValue.assigned !== "")
      query += "&isAssigned=" + searchValue.assigned;
    if (searchValue.manufacturer !== null && searchValue.manufacturer !== "")
      query += "&manufacturer=" + searchValue.manufacturer;
    this.commonService.notifyOther({ option: 'sensorstatus_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'sensorstatus_search', value: query });
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

  getBooleanLable() {
    const lists:any = {
      'Please Select': '',
      'Yes': 1,
      'No': 0,
    };
    let attributes = [];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }
   open_search(){
    this.isShow= !this.isShow;
  }
}
