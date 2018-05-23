import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-grouplist',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListSearchComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  statusLabel = this.getBooleanLable();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat: string;
  dateDialog: boolean = false;

  constructor(
    private globalService: GlobalService,
    private commonService: SearchService,
    private fb: FormBuilder,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    console.log('dateformat');
    console.log(this.dateFormat);
    this.searchForm = this.fb.group({
      groupName: [''],
      modifiedFrom: [''],
      modifiedTo: [''],
      createdFrom: [''],
      createdTo: ['']
    });
  }

  searchRecord(searchValue:any) {
    let searchObj: any;
    searchObj = {};

    if (searchValue.groupName !== null && searchValue.groupName !== '') {
      searchObj.GroupName = { value: searchValue.groupName, matchMode: 'contains' };
    }

    if (searchValue.modifiedFrom !== null && searchValue.modifiedFrom !== '') {
      searchObj.modifiedFrom = {
        value: this.globalService.formatDate(searchValue.modifiedFrom + ':00'),
        matchMode: 'contains'
      };
    }

    if (searchValue.modifiedTo !== null && searchValue.modifiedTo !== '') {
      searchObj.modifiedTo = {
        value: this.globalService.formatDate(searchValue.modifiedTo + ':59'),
        matchMode: 'contains'
      };
    }
    if (searchValue.createdFrom !== null && searchValue.createdFrom !== '') {
      searchObj.createdFrom = {
        value: this.globalService.formatDate(searchValue.createdFrom + ':00'),
        matchMode: 'contains'
      };
    }

    if (searchValue.createdTo !== null && searchValue.createdTo !== '') {
      searchObj.createdTo = {
        value: this.globalService.formatDate(searchValue.createdTo + ':59'),
        matchMode: 'contains'
      };
    }
    this.commonService.notifyOther({ option: 'groupList', value: searchObj });
    this.closeit('');
  }

  searchGlobal() {
    var query: any;
    query = {};
    if (this.globalSearch != null) {
      query.type = 'global';
      query.filter = { value: this.globalSearch, matchMode: 'contains' };
    }
    this.commonService.notifyOther({ option: 'groupList', value: query });
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
    this.dateDialog = false;
  }
  checkDateValidation(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog = true;
      console.log(this.dateDialog);
    }
  }
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE) {
      if (this.globalSearchFocus) {
        this.searchGlobal();
        this.closeit('');
      } else if (this.isShow) {
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
    if (
      !this.eRef.nativeElement.contains(event.target) &&
      !(
        event.target.classList.contains('ui-dropdown-lable') ||
        event.target.classList.contains('ui-dropdown-item')
      )
    ) {
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
      All: '',
      Yes: 1,
      No: 0
    };
    let attributes = [];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }
  open_search() {
    this.isShow = false;
  }
}
