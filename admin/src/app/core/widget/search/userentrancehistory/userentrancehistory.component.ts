import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
// import { LocationService } from './../../../../masters/locations/shared/location.service';

@Component({
  selector: 'app-search-userentrancehistory',
  templateUrl: './userentrancehistory.component.html',
  /*styleUrls: ['./diagn_producttracking.component.css'],*/
  providers: [GlobalService]
})
export class UserEntranceHistoryComponent implements OnInit {
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
      entryTimeFrom: [''],
      entryTimeTo: [''],
      exitTimeFrom: [''],
      exitTimeTo: [''],
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

    if (searchValue.entryTimeFrom !== '' && searchValue.entryTimeTo !== '') {
      if (searchValue.entryTimeFrom > searchValue.entryTimeTo) {
        showmessage1 = true;
        message = 'Entry Time From could not be greater that Entry Time To';
      }
    }

    if (showmessage1 === false && searchValue.exitTimeFrom !== '' && searchValue.exitTimeTo !== '') {
      if (searchValue.exitTimeFrom > searchValue.exitTimeTo) {
        showmessage2 = true;
        message = 'Exit Time From could not be greater that Exit Time To';
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
      
      if (searchValue.entryTimeFrom !== null && searchValue.entryTimeFrom !== '') {
        this.searchObj.entryTimeFrom = {
          value: this.globalService.formatDate(searchValue.entryTimeFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.entryTimeTo !== null && searchValue.entryTimeTo !== '') {
        this.searchObj.entryTimeTo = {
          value: this.globalService.formatDate(searchValue.entryTimeTo + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.exitTimeFrom !== null && searchValue.exitTimeFrom !== '') {
        this.searchObj.exitTimeFrom = {
          value: this.globalService.formatDate(searchValue.exitTimeFrom + ':00'),
          matchMode: 'Contains'
        };
      }

      if (searchValue.exitTimeTo !== null && searchValue.exitTimeTo !== '') {
        this.searchObj.exitTimeTo = {
          value: this.globalService.formatDate(searchValue.exitTimeTo + ':00'),
          matchMode: 'Contains'
        };
      }

      this.commonService.notifyOther({ option: 'userentrancehistory_search', value: this.searchObj });
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

    this.commonService.notifyOther({ option: 'userentrancehistory_search', value: this.searchObj });

    console.log('Here I am = ' + this.globalSearch);
  }

  reset() {
    this.searchObj = {};
    this.searchForm.reset();
    this.globalSearch = null;
    this.commonService.notifyOther({ option: 'userentrancehistory_search', value: this.searchObj });
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
