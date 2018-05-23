import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-userentrance',
  templateUrl: './userentrance.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class UserEntranceComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  users = [];
  locations:any = [];
  floors:any = [];
  zones:any = [];
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
      user: [''],
      location: [''],
      floor: [''],
      zone: [''],
      dateFrom: [''],
      dateTo: [''],
      firstInFrom: [''],
      firstInTo: [''],
      lastOutFrom: [''],
      lastOutTo: [''],
    });

    this.globalService.getDropdown('users' + environment.serverEnv).subscribe((data: any) => {
      this.users = this.globalService.prepareDropDown(data.data, 'Select User');
    });

    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.locations = this.globalService.prepareDropDown(data.data, 'Select Location');
    });
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
    let message = '';
    let showmessage1 = false;
    let showmessage2 = false;
    let showmessage3 = false;

    if (searchValue.dateFrom !== '' && searchValue.dateTo !== '') {
      if (searchValue.dateFrom > searchValue.dateTo) {
        showmessage1 = true;
        message = 'Date From could not be greater that Date To';
      }
    }

    if (showmessage1 === false && searchValue.firstInFrom !== '' && searchValue.firstInTo !== '') {
      if (searchValue.firstInFrom > searchValue.firstInTo) {
        showmessage2 = true;
        message = 'First In From could not be greater that First In To';
      }
    }

    if (showmessage1 === false && showmessage2 === false && searchValue.lastOutFrom !== '' && searchValue.lastOutTo !== '') {
      if (searchValue.lastOutFrom > searchValue.lastOutTo) {
        showmessage3 = true;
        message = 'Last Out From could not be greater that Last Out To';
      }
    }

    if (showmessage1 === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else if (showmessage2 === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else if (showmessage3 === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else {
      this.showmessage = false;
      this.validation_message = '';
    }

    if (this.showmessage === false) {
      if (searchValue.user !== null && searchValue.user !== '') {
        this.searchObj.user = { value: searchValue.user, matchMode: 'Contains' };
      }
      if (searchValue.location !== null && searchValue.location !== '') {
        this.searchObj.location = { value: searchValue.location, matchMode: 'Contains' }
      }
      if (searchValue.floor !== null && searchValue.floor !== '') {
        this.searchObj.floor = { value: searchValue.floor, matchMode: 'Contains' }
      }
      if (searchValue.zone !== null && searchValue.zone !== '') {
        this.searchObj.zone = { value: searchValue.zone, matchMode: 'Contains' }
      }

      if (searchValue.dateFrom !== null && searchValue.dateFrom !== '') {
        const dd = moment(searchValue.dateFrom);
        dd.set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.searchObj.dateFrom = {
          value: dd.tz(window.localStorage.getItem('userTimeZone'))
          .utc()
          .format(),
          matchMode: 'Contains'
        };
      }

      if (searchValue.dateTo !== null && searchValue.dateTo !== '') {
        const dd = moment(searchValue.dateTo);
        dd.set({hour: 23, minute: 59, second: 59, millisecond: 999});
        this.searchObj.dateTo = {
          value: dd.tz(window.localStorage.getItem('userTimeZone'))
          .utc()
          .format(),
          matchMode: 'Contains'
        };
      }
      
      if (searchValue.firstInFrom !== null && searchValue.firstInFrom !== '') {
        this.searchObj.firstInFrom = {
          value: this.globalService.formatDate(searchValue.firstInFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.firstInTo !== null && searchValue.firstInTo !== '') {
        this.searchObj.firstInTo = {
          value: this.globalService.formatDate(searchValue.firstInTo + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.lastOutFrom !== null && searchValue.lastOutFrom !== '') {
        this.searchObj.lastOutFrom = {
          value: this.globalService.formatDate(searchValue.lastOutFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.lastOutTo !== null && searchValue.lastOutTo !== '') {
        this.searchObj.lastOutTo = {
          value: this.globalService.formatDate(searchValue.lastOutTo + ':00'),
          matchMode: 'Contains'
        };
      }

      this.commonService.notifyOther({ option: 'userentrance_search', value: this.searchObj });
      this.closeSearchBox('');
    }
  }
  openSearchBox() {
    this.isShow = !this.isShow;
  }

  searchGlobal() {
    if (this.globalSearch !== null && this.globalSearch !== '') {
      this.searchObj.filter = { value: this.globalSearch, matchMode: 'Contains' };
    }

    this.commonService.notifyOther({ option: 'userentrance_search', value: this.searchObj });

    console.log('Here I am = ' + this.globalSearch);
  }

  reset() {
    this.searchObj = {};
    this.searchForm.reset();
    this.globalSearch = null;
    this.commonService.notifyOther({ option: 'userentrance_search', value: this.searchObj });
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

  fetchAndPopulateFloors(locationId:any) {
    this.globalService.getDropdown('locations' + environment.serverEnv + '/' + locationId +  '/floors').subscribe((data:any) => {
      this.floors = this.globalService.prepareDropDown(data.data, 'Select Floor');
    });
  }

  fetchAndPopulateZones(floorId:any) {
    this.globalService.getDropdown('locations' + environment.serverEnv + '/floors/' + floorId +  '/zones').subscribe((data:any) => {
      this.zones = this.globalService.prepareDropDown(data.data, 'Select Check Point');
    });
  }

}
