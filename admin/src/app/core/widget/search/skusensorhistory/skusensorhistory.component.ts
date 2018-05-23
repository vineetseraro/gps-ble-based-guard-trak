import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { Dropdown } from './../../../global.model';

@Component({
  selector: 'app-search-skusensorhistory',
  templateUrl: './skusensorhistory.component.html',
  styleUrls: ['./skusensorhistory.component.css']
})
export class SkusensorhistoryComponent implements OnInit {
searchForm: FormGroup; // our model driven form
  statusLabel = this.getBooleanLable();
  dropDown: Dropdown[];
  carrierUser: SelectItem[];
  public isShow: boolean = false;
  public globalSearchFocus: boolean = false;
  globalSearch: any;
  dateFormat:string;
dateDialog : boolean = false;
dateDialog1 : boolean = false;
associationDate : boolean =true;
diassociationDate : boolean =true;

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
      'name': [''],
      'associationFrom': [''],
      'associationTo': [''],
      'diassociationFrom': [''],
      'diassociationTo': [''],
      'currentlyAssociated': ['']
    });
  }
 

  searchRecord(searchValue:any) {
    this.associationDate = this.globalService.checkDateValidation(searchValue.associationFrom, searchValue.associationTo);
    this.diassociationDate = this.globalService.checkDateValidation(searchValue.diassociationFrom, searchValue.diassociationTo);
    if (!this.associationDate || !this.diassociationDate) {
      this.dateDialog = true;
      return false;
    }
    var query = "";
    console.log(searchValue.modifiedFrom);
    if (searchValue.name !== null && searchValue.name !== "")
      query += "&thing=" + searchValue.name;
    if (searchValue.associationFrom !== null && searchValue.associationFrom !== "")
      query += "&associatedOnFrom=" + this.globalService.formatDate(searchValue.associationFrom);
    if (searchValue.associationTo !== null && searchValue.associationTo !== "")
      query += "&associatedOnTo=" + this.globalService.formatDate(searchValue.associationTo);
    if (searchValue.diassociationFrom !== null && searchValue.diassociationFrom !== "")
      query += "&disassociatedOnFrom=" + this.globalService.formatDate(searchValue.diassociationFrom);
    if (searchValue.diassociationTo !== null && searchValue.diassociationTo !== "")
      query += "&disassociatedOnTo=" + this.globalService.formatDate(searchValue.diassociationTo);
    if (searchValue.currentlyAssociated !== null && searchValue.currentlyAssociated !== "")
      query += "&currentlyAssociated=" + searchValue.currentlyAssociated;
    
   
    this.commonService.notifyOther({ option: 'simple_search', value: query });
    this.closeit('');
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'simple_search', value: query });
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
  this.dateDialog =false;
  }
  checkDateValidation(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog=true;
      console.log(this.dateDialog);
    }
  }
  closeDialog1() {
  this.dateDialog1 =false;
  }
  checkDateValidation1(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog1=true;
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
    console.log(event.target);
    if (!this.eRef.nativeElement.contains(event.target) && !
      (event.target.classList.contains('ui-dropdown-lable') || event.target.classList.contains('ui-dropdown-item'))) {
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
 open_search(){
    this.isShow= !this.isShow;
  }
}
