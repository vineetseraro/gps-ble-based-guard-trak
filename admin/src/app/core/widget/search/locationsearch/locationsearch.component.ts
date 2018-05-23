import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-locationsearch',
  templateUrl: './locationsearch.component.html',
  styleUrls: ['./locationsearch.component.css'],
  // animations: [
  //   trigger('dialog', [
  //     transition('void => *', [
  //       style({ transform: 'scale3d(.3, .3, .3)' }),
  //       animate(100)
  //     ]),
  //     transition('* => void', [
  //       animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
  //     ])
  //   ])
  // ]
})
export class LocationsearchComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  statusLabel = this.getBooleanLable();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  categories: any;
  dateDialog : boolean = false;

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
      'locationName': [''],
      'modifiedFrom': [''],
      'modifiedTo': [''],
      'status': ['']
    });
  }


closeDialog() {
  this.dateDialog =false;
  }

  searchRecord(searchValue:any) {
    let validateDate = this.globalService.checkDateValidation(searchValue.modifiedFrom, searchValue.modifiedTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    if (searchValue.locationName != null && searchValue.locationName !== "")
      query += "&name=" + searchValue.locationName;
    if (searchValue.modifiedFrom !== null && searchValue.modifiedFrom !== "")
      query += "&updatedOnFrom=" + this.globalService.formatDate(searchValue.modifiedFrom);
    if (searchValue.modifiedTo !== null && searchValue.modifiedTo !== "")
      query += "&updatedOnTo=" + this.globalService.formatDate(searchValue.modifiedTo);
    if (searchValue.status != null && searchValue.status !== "") {
      if (searchValue.status == true)
        query += "&status=1";
      else
        query += "&status=0";
    }
    this.commonService.notifyOther({ option: 'location_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'location_search', value: query });
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
  
  open_search() {
    this.isShow = !this.isShow;
  }
}