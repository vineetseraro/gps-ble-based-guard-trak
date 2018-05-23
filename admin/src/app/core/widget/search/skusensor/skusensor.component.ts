import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-skusensor',
  templateUrl: './skusensor.component.html',
  styleUrls: ['./skusensor.component.css']
})
export class SkusensorComponent implements OnInit {

  searchForm: FormGroup; // our model driven form
  statusLabel = this.getBooleanLable();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;
  products: SelectItem[];
  sensors: SelectItem[] = [];
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
      'name': [''],
      'modifiedFrom': [''],
      'modifiedTo': [''],
      'product': [''],
      'sensorAttached': [[]],
    });
    this.globalService.geSensors('things'+environment.serverEnv+'/beacons').subscribe((data:any) => {
      this.sensors = this.globalService.prepareDropDown(data.data, '');
    });
    this.globalService.getDropdown('products'+environment.serverEnv).subscribe((data:any) => {
      this.products = this.globalService.prepareDropDown(data.data, '');
    });
  }
 

  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.modifiedFrom, searchValue.modifiedTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    console.log(searchValue.modifiedFrom);
    if (searchValue.name !== null && searchValue.name !== "")
      query += "&code=" + searchValue.name;
    if (searchValue.modifiedFrom !== null && searchValue.modifiedFrom !== "")
      query += "&lastThingsChangeOnFrom=" + this.globalService.formatDate(searchValue.modifiedFrom);
    if (searchValue.modifiedTo !== null && searchValue.modifiedTo !== "")
      query += "&lastThingsChangeOnTo=" + this.globalService.formatDate(searchValue.modifiedTo);
    if (searchValue.product !== null && searchValue.product !== "")
      query += "&product=" + searchValue.product;
    if (searchValue.sensorAttached !== null && searchValue.sensorAttached !== "") {
      let sensors = searchValue.sensorAttached.join(',');
      if(sensors !="")
        query += "&things=" + sensors;
    }
   
    this.commonService.notifyOther({ option: 'skusensor', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'skusensor', value: query });
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
      console.log(this.dateDialog);
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE) {
      if (this.globalSearchFocus) {
        this.searchGlobal();
        this.closeit('');
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
    console.log(event.target);
    if (!this.eRef.nativeElement.contains(event.target) && !
      (event.target.classList.contains('ui-dropdown-lable') || event.target.classList.contains('ui-dropdown-item'))) {
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
      'All': '',
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
