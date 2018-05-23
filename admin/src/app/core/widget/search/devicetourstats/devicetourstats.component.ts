import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';
import * as moment from 'moment';

@Component({
  selector: 'app-search-devicetourstats',
  templateUrl: './devicetourstats.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class DeviceTourStatsComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  rangeTypes = [];
  public isShow: boolean = false;
  searchObj: any;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  validation_message: string;
  showmessage: boolean = false;
  dateDialog: boolean = false;
  
  constructor(
    private commonService: SearchService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.searchObj = {};
    this.searchForm = this.fb.group({
      filter: [''],
      range: [''],
      utcoffset: [''],
      device: [''],
      tourStartFrom: [''],
      tourStartTo: [''],
      tourEndFrom: [''],
      tourEndTo: ['']
    });

    this.rangeTypes = [
      { label: 'All', value: 'all' },
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' }
    ];

  }

  closeDialog() {
    this.dateDialog = false;
  }
  checkDateValidation(fromDate: any, toDate: any, msg: any) {
    msg;
    if (fromDate > toDate) {
      this.dateDialog = true;
    }
  }

  searchRecord(searchValue: any) {
    const validateDate = this.globalService.checkDateValidation(searchValue.actionDateFrom, searchValue.actionDateTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }

    if (searchValue.range !== null && searchValue.range !== '') {
      this.searchObj.range = { value: searchValue.range, matchMode: 'Contains' };
    }

    this.searchObj.utcoffset = { value: moment().utcOffset(), matchMode: 'Contains' };

    if (searchValue.device !== null && searchValue.device !== '') {
      this.searchObj.device = { value: searchValue.device, matchMode: 'Contains' };
    }

    if (searchValue.tourStartFrom !== null && searchValue.tourStartFrom !== '') {
      this.searchObj.tourStartFrom = {
        value: this.globalService.formatDate(searchValue.tourStartFrom + ':00'),
        matchMode: 'Contains'
      };
    }

    if (searchValue.tourStartTo !== null && searchValue.tourStartTo !== '') {
      this.searchObj.tourStartTo = {
        value: this.globalService.formatDate(searchValue.tourStartTo + ':00'),
        matchMode: 'Contains'
      };
    }

    if (searchValue.tourEndFrom !== null && searchValue.tourEndFrom !== '') {
      this.searchObj.tourEndFrom = {
        value: this.globalService.formatDate(searchValue.tourEndFrom + ':00'),
        matchMode: 'Contains'
      };
    }

    if (searchValue.tourEndTo !== null && searchValue.tourEndTo !== '') {
      this.searchObj.tourEndTo = {
        value: this.globalService.formatDate(searchValue.tourEndTo + ':00'),
        matchMode: 'Contains'
      };
    }

    this.commonService.notifyOther({ option: 'devicetourstats_search', value: this.searchObj, range: searchValue.range });

    this.closeSearchBox('');
  }

  searchGlobal() {
    let query = '';
    if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch;
    }

    this.commonService.notifyOther({ option: 'devicetourstats_search', value: query });
  }

  openSearchBox() {
    this.isShow = !this.isShow;
  }

  reset() {
    this.searchForm.reset();
    this.globalSearch = null;
    this.searchGlobal();
    this.closeSearchBox('');
  }

  closeSearchBox(event) {
    event;
    this.isShow = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
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
      this.closeSearchBox('');
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (
      !this.eRef.nativeElement.contains(event.target) &&
      !event.target.classList.contains('ng-tns-c9-3')
    ) {
      if (event.target.classList.length === 1) {
        if (!event.target.classList[0].includes('ng-tns-c')) {
          this.closeSearchBox('');
        }
      }
      if (event.target.classList.length === 2) {
        if (!event.target.classList[1].includes('ng-tns-c')) {
          this.closeSearchBox('');
        }
      }
    }
  }
}
