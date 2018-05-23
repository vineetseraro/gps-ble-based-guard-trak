import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { UserService } from '../../../../masters/users/shared/user.service';

@Component({
  selector: 'app-search-task',
  templateUrl: './task.component.html',
  providers: [GlobalService, UserService]
})
export class TaskComponent implements OnInit {
  statusLabel = this.globalService.getBooleanLabel();
  searchForm: FormGroup; // our model driven form
  dateFormat: string;
  users = [];
  public isShow = false;
  searchObj: any;
  public globalSearchFocus = false;
  globalSearch: any;
  validation_message: string;
  showmessage = false;
  dateDialog = false;
  allUsers: any = [];

  constructor(
    private commonService: SearchService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private eRef: ElementRef,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();

    this.userService.listUsers('').subscribe(
      (data: any) => {
          this.allUsers = data.data;
      },
      (error: any) => {
          error;
      }
    );

    this.searchObj = {};
    this.searchForm = this.fb.group({
      name: [''],
      from: [''],
      to: [''],
      users: [''],
      modifiedFrom: [''],
      status: ['']
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
    let query = '';

    if (searchValue.from !== '' && searchValue.to !== '') {
      if (searchValue.from > searchValue.to) {
        showmessage1 = true;
        message = 'From date could not be greater than To Date';
      }
    }

    if (showmessage1 === true) {
      this.showmessage = true;
      this.validation_message = message;
    } else {
      this.showmessage = false;
      this.validation_message = '';
    }

    if (this.showmessage === false) {
      if (searchValue.name !== null && searchValue.name !== '') {
        query += '&name=' + searchValue.name;
      }
      if (searchValue.status !== null && searchValue.status !== '') {
        query += '&status=' + searchValue.status;
      }
      if (searchValue.users !== null && searchValue.users !== '') {
        query += '&attendee=' + searchValue.users;
      }
      if (searchValue.from !== null && searchValue.from !== '') {
        query += '&startFrom=' + this.globalService.formatDate(searchValue.from);
        if (searchValue.to !== null && searchValue.to !== '') {
          query += '&endTo=' + this.globalService.formatDate(searchValue.to);
        }
      }
      if ( searchValue.modifiedFrom !== null && searchValue.modifiedFrom !== '' && searchValue.modifiedFrom.length ) {
        if (searchValue.modifiedFrom[0] !== null && searchValue.modifiedFrom[0] !== '') {
          query += '&updatedOnFrom=' + this.globalService.formatDate(searchValue.modifiedFrom[0]);
        }
        if (searchValue.modifiedFrom[1] !== null && searchValue.modifiedFrom[1] !== '') {
          query += '&updatedOnTo=' + this.globalService.formatDate(searchValue.modifiedFrom[1]);
        }
      }
      this.commonService.notifyOther({ option: 'task_search', value: query });

      this.closeSearchBox('');
    }
  }
  openSearchBox() {
    this.isShow = !this.isShow;
  }

  searchGlobal() {
    let query = '';
    if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch;
    }
    this.commonService.notifyOther({ option: 'task_search', value: query });

    console.log('Here I am = ' + this.globalSearch);
  }

  reset() {
    this.validation_message = '';
    this.searchObj = {};
    this.searchForm.reset();
    this.globalSearch = null;
    this.commonService.notifyOther({ option: 'task_search', value: '' });
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
