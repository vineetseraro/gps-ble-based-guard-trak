import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-loginhistory',
  templateUrl: './loginhistory.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class LoginHistoryComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  users = [];
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
      device: [''],
      loginTimeFrom: [''],
      loginTimeTo: [''],
      logoutTimeFrom: [''],
      logoutTimeTo: ['']

    });

    this.globalService.getDropdown('users' + environment.serverEnv).subscribe((data: any) => {
      this.users = this.globalService.prepareDropDown(data.data, 'Select User');
      console.log(this.users);
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
    if (searchValue.loginTimeFrom !== '' && searchValue.loginTimeTo !== '') {
      if (searchValue.loginTimeFrom > searchValue.loginTimeTo) {
        showmessage1 = true;
        message = 'Login Time From could not be greater that Login Time To';
      }
    }

    if (showmessage1 === false && searchValue.logoutTimeFrom !== '' && searchValue.logoutTimeTo !== '') {
      if (searchValue.logoutTimeFrom > searchValue.logoutTimeTo) {
        showmessage2 = true;
        message = 'Logout Time From could not be greater that Logout Time To';
      }
    }

    if (showmessage1 === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else if (showmessage2 === true) {
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
      if (searchValue.device !== null && searchValue.device !== '') {
        this.searchObj.device = { value: searchValue.device, matchMode: 'Contains' };
      }
      if (searchValue.loginTimeFrom !== null && searchValue.loginTimeFrom !== '') {
        this.searchObj.loginTimeFrom = {
          value: this.globalService.formatDate(searchValue.loginTimeFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.loginTimeTo !== null && searchValue.loginTimeTo !== '') {
        this.searchObj.loginTimeTo = {
          value: this.globalService.formatDate(searchValue.loginTimeTo + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.logoutTimeFrom !== null && searchValue.logoutTimeFrom !== '') {
        this.searchObj.logoutTimeFrom = {
          value: this.globalService.formatDate(searchValue.logoutTimeFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.logoutTimeTo !== null && searchValue.logoutTimeTo !== '') {
        this.searchObj.logoutTimeTo = {
          value: this.globalService.formatDate(searchValue.logoutTimeTo + ':00'),
          matchMode: 'Contains'
        };
      }

      this.commonService.notifyOther({ option: 'loginhistory_search', value: this.searchObj });
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

    this.commonService.notifyOther({ option: 'loginhistory_search', value: this.searchObj });

    console.log('Here I am = ' + this.globalSearch);
  }

  reset() {
    this.searchObj = {};
    this.searchForm.reset();
    this.globalSearch = null;
    this.commonService.notifyOther({ option: 'loginhistory_search', value: this.searchObj });
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
