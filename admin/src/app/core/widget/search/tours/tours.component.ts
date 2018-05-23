import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-tours',
  templateUrl: './tours.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class ToursComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  users = [];
  locations = [];
  actionTypes = [];
  public isShow = false;
  searchObj: any;
  public globalSearchFocus = false;
  globalSearch: any;
  validation_message: string;
  showmessage = false;
  dateDialog = false;

  constructor(
    private commonService: SearchService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private eRef: ElementRef
  ) { }

  applySavedSearch() {
    if (window.localStorage.hasOwnProperty('tourSearch')) {
      const search = window.localStorage.getItem('tourSearch');
      const searchData = search.split('&filter=');
      if (searchData.length > 1) {
        // global serach
        this.globalSearch = searchData[1];
      } else {
        // specific search
        const specificSearchObj = searchData[0].split('&');
        specificSearchObj.forEach(val => {
          if (val) {
            const schKeyData = val.split('=');
            switch (schKeyData[0]) {
              case 'tour':
                this.searchForm.patchValue({
                  device: schKeyData[1]
                });
                break;
              case 'device':
                this.searchForm.patchValue({
                  device: schKeyData[1]
                });
                break;
              case 'attendee':
                this.searchForm.patchValue({
                  user: schKeyData[1]
                });
                break;
              case 'tourStartFrom':
                this.searchForm.patchValue({
                  tourStartFrom: this.globalService.searchcalendarformatDate(schKeyData[1], true)
                });
                break;
              case 'tourStartTo':
                this.searchForm.patchValue({
                  tourStartTo: this.globalService.searchcalendarformatDate(schKeyData[1], true)
                });
                break;
              case 'tourEndFrom':
                this.searchForm.patchValue({
                  tourEndFrom: this.globalService.searchcalendarformatDate(schKeyData[1], true)
                });
                break;
              case 'tourEndTo':
                this.searchForm.patchValue({
                  tourEndTo: this.globalService.searchcalendarformatDate(schKeyData[1], true)
                });
                break;
            }
          }
        });
      }
    }
  }

  ngOnInit() {
    // this.savedSearch = '';
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.searchObj = {};
    this.searchForm = this.fb.group({
      filter: [''],
      user: [''],
      tour: [''],
      device: [''],
      tourStartFrom: [''],
      tourStartTo: [''],
      tourEndFrom: [''],
      tourEndTo: ['']
    });

    this.globalService.getDropdown('users' + environment.serverEnv, 'filter=AkGuard').subscribe((data: any) => {
      this.users = this.globalService.prepareDropDown(data.data, 'Select Guard');
    });
    setTimeout(() => {
      this.applySavedSearch();
    }, 2000);
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
    let query = '';

    if (searchValue.tour !== null && searchValue.tour !== '') {
      query += '&tour=' + searchValue.tour;
    }

    if (searchValue.user !== null && searchValue.user !== '') {
      query += '&attendee=' + searchValue.user;
    }

    if (searchValue.device !== null && searchValue.device !== '') {
      query += '&device=' + searchValue.device;
    }

    if (searchValue.tourStartFrom !== null && searchValue.tourStartFrom !== '') {
      query += '&tourStartFrom=' + this.globalService.formatDate(searchValue.tourStartFrom);
    }

    if (searchValue.tourStartTo !== null && searchValue.tourStartTo !== '') {
      query += '&tourStartTo=' + this.globalService.formatDate(searchValue.tourStartTo);
    }

    if (searchValue.tourEndFrom !== null && searchValue.tourEndFrom !== '') {
      query += '&tourEndFrom=' + this.globalService.formatDate(searchValue.tourEndFrom);
    }

    if (searchValue.tourEndTo !== null && searchValue.tourEndTo !== '') {
      query += '&tourEndTo=' + this.globalService.formatDate(searchValue.tourEndTo);
    }

    this.commonService.notifyOther({ option: 'tours_search', value: query });
    this.closeSearchBox('');
  }

  searchGlobal() {
    let query = '';
    if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch;
    }

    // this.commonService.notifyOther({ option: 'tours_search', value: query, savedSearch: this.savedSearch });
    this.commonService.notifyOther({ option: 'tours_search', value: query });
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
