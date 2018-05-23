import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-tourincidents',
  templateUrl: './tourincidents.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class TourincidentsComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  users = [];
  locations = [];
  // actionTypes = [];
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
      tour: [''],
      device: [''],
      location: [''],
      actionType: [''],
      actionDateFrom: [''],
      actionDateTo: ['']
    });

    this.globalService.getDropdown('users' + environment.serverEnv, 'filter=AkGuard').subscribe((data: any) => {
      this.users = this.globalService.prepareDropDown(data.data, 'Select Guard');
      console.log(this.users);
    });
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data: any) => {
      this.locations = this.globalService.prepareDropDown(data.data, 'Select Location');
      console.log(this.locations);
    });
    /*this.actionTypes = [
      { label: 'Start', value: 'Start' },
      { label: 'End', value: 'End' },
      { label: 'Scan', value: 'Scan' },
      { label: 'Incident', value: 'Incident' }
    ];*/
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

  searchRecord(searchValue:any) {
    const validateDate = this.globalService.checkDateValidation(searchValue.actionDateFrom, searchValue.actionDateTo);
    if (!validateDate) {
      this.dateDialog = true;
      return false;
    }
    let query = '';

    if (searchValue.tour !== null && searchValue.tour !== '') {
      query += '&tour=' + searchValue.tour;
    }

    if (searchValue.device !== null && searchValue.device !== '') {
      query += '&device=' + searchValue.device;
    }

    if (searchValue.user !== null && searchValue.user !== '') {
      query += '&attendee=' + searchValue.user;
    }

    if (searchValue.location !== null && searchValue.location !== '') {
      query += '&location=' + searchValue.location;
    }

    if (searchValue.actionDateFrom !== null && searchValue.actionDateFrom !== '') {
      query += '&actionDateFrom=' + this.globalService.formatDate(searchValue.actionDateFrom);
    }

    if (searchValue.actionDateTo !== null && searchValue.actionDateTo !== '') {
      query += '&actionDateTo=' + this.globalService.formatDate(searchValue.actionDateTo);
    }

    this.commonService.notifyOther({ option: 'tourincidents_search', value: query });
    this.closeSearchBox('');
  }

  searchGlobal() {
    let query = '';
    if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch;
    }

    this.commonService.notifyOther({ option: 'tourincidents_search', value: query });
  }

  /*searchRecord(searchValue: any) {
    let message = '';
    let showmessage = false;

    if (searchValue.actionDateFrom !== '' && searchValue.actionDateTo !== '') {
      if (searchValue.actionDateFrom > searchValue.actionDateTo) {
        showmessage = true;
        message = 'Event Date From could not be greater that Event Date To';
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
      if (searchValue.tour !== null && searchValue.tour !== '') {
        this.searchObj.tourId = { value: searchValue.tour, matchMode: 'Contains' };
      }
      if (searchValue.user !== null && searchValue.user !== '') {
        this.searchObj.attendee = { value: searchValue.user, matchMode: 'Contains' };
      }
      if (searchValue.location !== null && searchValue.location !== '') {
        this.searchObj.location = { value: searchValue.location, matchMode: 'Contains' };
      }
      if (searchValue.actionType !== null && searchValue.actionType !== '') {
        this.searchObj.actionType = { value: searchValue.actionType, matchMode: 'Contains' };
      }
      if (searchValue.actionDateFrom !== null && searchValue.actionDateFrom !== '') {
        this.searchObj.actionDateFrom = {
          value: this.globalService.formatDate(searchValue.actionDateFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.actionDateTo !== null && searchValue.actionDateTo !== '') {
        this.searchObj.actionDateTo = {
          value: this.globalService.formatDate(searchValue.actionDateTo + ':00'),
          matchMode: 'Contains'
        };
      }

      this.commonService.notifyOther({ option: 'tourevents_search', value: this.searchObj });
      this.closeSearchBox('');
    }
  }
  
  searchGlobal() {
    if (this.globalSearch !== null && this.globalSearch !== '') {
      this.searchObj.filter = { value: this.globalSearch, matchMode: 'Contains' };
    }

    this.commonService.notifyOther({ option: 'tourevents_search', value: this.searchObj });

    console.log('Here I am = ' + this.globalSearch);
  }*/

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
