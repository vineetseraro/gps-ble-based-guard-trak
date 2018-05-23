import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-devicelocator',
  templateUrl: './devicelocator.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService, LocationService]
})
export class DeviceLocatorComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  locations = [];
  floors = [];
  zones = [];
  public isShow: boolean = false;
  searchObj: any;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  validation_message: string;
  showmessage: boolean = false;
  dateDialog: boolean = false;
  locationTypeLabel = this.getLocationTypes();

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
      location: [''],
      locationType: [''],
      floor: [''],
      zone: [''],
      device: [''],
      trackedFrom: [''],
      trackedTo: ['']
    });

    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data: any) => {
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
    let showmessage = false;
    if (searchValue.trackedFrom !== '' && searchValue.trackedTo !== '') {
      if (searchValue.trackedFrom > searchValue.trackedTo) {
        showmessage = true;
        message = 'Tracked Date From could not be greater that Tracked Date To';
      }
    }

    if (showmessage === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else {
      this.showmessage = false;
      this.validation_message = '';
    }

    if (this.showmessage === false) {
      if (searchValue.location !== null && searchValue.location !== '') {
        this.searchObj.location = { value: searchValue.location, matchMode: 'Contains' };
      }
      if (searchValue.floor !== null && searchValue.floor !== '') {
        this.searchObj.floor = { value: searchValue.floor, matchMode: 'Contains' };
      }
      if (searchValue.zone !== null && searchValue.zone !== '') {
        this.searchObj.zone = { value: searchValue.zone, matchMode: 'Contains' };
      }
      if (searchValue.device !== null && searchValue.device !== '') {
        this.searchObj.device = { value: searchValue.device, matchMode: 'Contains' };
      }
      if (searchValue.locationType != null) {
        if (searchValue.status == true)
          this.searchObj.locationType = { value: searchValue.locationType, matchMode: 'Contains' };
        else
          this.searchObj.locationType = { value: searchValue.locationType, matchMode: 'Contains' };
      }
      if (searchValue.trackedFrom !== null && searchValue.trackedFrom !== '') {
        this.searchObj.trackedFrom = {
          value: this.globalService.formatDate(searchValue.trackedFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.trackedTo !== null && searchValue.trackedTo !== '') {
        this.searchObj.trackedTo = {
          value: this.globalService.formatDate(searchValue.trackedTo + ':00'),
          matchMode: 'Contains'
        };
      }

      this.commonService.notifyOther({ option: 'devicelocator_search', value: this.searchObj });
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

    this.commonService.notifyOther({ option: 'devicelocator_search', value: this.searchObj });

    console.log('Here I am = ' + this.globalSearch);
  }

  reset() {
    this.searchObj = {};
    this.searchForm.reset();
    this.globalSearch = null;
    this.commonService.notifyOther({ option: 'devicelocator_search', value: this.searchObj });
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
  getLocationTypes() {
    const lists: any = {
      All: '',
      Known: 'known',
      Unknown: 'unknown'
    };
    let attributes = [];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }
  fetchAndPopulateFloors(locationId) {
    console.log();
    // this.serviceUrlFloor + '/' + id + '/floors
    this.globalService
      .getDropdown('locations' + environment.serverEnv + '/' + locationId + '/floors')
      .subscribe((data: any) => {
        this.floors = this.globalService.prepareDropDown(data.data, 'Select Floor');
      });
  }

  fetchAndPopulateZones(floorId) {
    this.globalService
      .getDropdown('locations' + environment.serverEnv + '/floors/' + floorId + '/zones')
      .subscribe((data: any) => {
        this.zones = this.globalService.prepareDropDown(data.data, 'Select Check Point');
      });
  }
}
