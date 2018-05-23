import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';
import { UserPoolGroupService } from './../../../../masters/userpools/shared/userpool.service';

@Component({
  selector: 'app-search-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  searchForm: FormGroup; // our model driven form
  // shipmentStatus = environment.shipmentStatus.Open;
  shipmentStatus = this.globalService.getShipmentStatusDropDown();
  carrierUsers = [];
  public isShow: boolean = false;
  globalSearch: any;
  public globalSearchFocus: boolean = false;
  dateFormat:string;
  dateDialog : boolean = false;
  dateDialog1 : boolean = false;
  deliveryDate = true;
  createdDate = true;

  constructor(
    private globalService: GlobalService,
    private commonService: SearchService,
    private fb: FormBuilder,
    private userPoolGroupService: UserPoolGroupService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.searchForm = this.fb.group({
      'orderNo': [''],
      'shipmentNo': [''],
      'carrierUser': [''],
      'status': [''],
      'deliveryFrom': [''],
      'deliveryTo': [''],
      'creationFrom': [''],
      'creationTo': [''],
    });

    this.userPoolGroupService.listUsersInGroup('AkCarrier').subscribe((data:any) => {
        const users = [];
        for (let i = 0; i < data['Users'].length; i++) {
            const isApproved = data['Users'][i].Attributes.filter(x => (x.Name === 'custom:isAdminApproved' && x.Value === 'yes'));
            if (isApproved.length) {
                const sub = data['Users'][i].Attributes.filter((x:any) => x.Name === 'sub')[0].Value;
                const fName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'given_name')[0].Value;
                const lName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'family_name')[0].Value;
                users.push({
                    'id': sub,
                    'name': fName + ' ' + lName
                });
            }
        }
        this.carrierUsers = this.globalService.prepareDropDown(users, 'Select Carrier User');
    });
  }


  searchRecord(searchValue:any) {

    this.deliveryDate = this.globalService.checkDateValidation(searchValue.deliveryFrom, searchValue.deliveryTo);
    this.createdDate = this.globalService.checkDateValidation(searchValue.creationFrom, searchValue.creationTo);
    if (!this.deliveryDate || !this.createdDate) {
      this.dateDialog = true;
      return false;
    }

    let query = '';

    if (searchValue.shipmentNo !== null && searchValue.shipmentNo !== '') {
      query += '&shipmentNo=' + searchValue.shipmentNo;
    }

    if (searchValue.carrierUser != null && searchValue.carrierUser !== '') {
      query += '&carrier=' + searchValue.carrierUser;
    }

    if (searchValue.deliveryFrom !== null && searchValue.deliveryFrom !== '') {
      query += '&etd=' + this.globalService.formatDate(searchValue.deliveryFrom);
      if (searchValue.deliveryTo !== null && searchValue.deliveryTo !== '') {
        query += '--' + this.globalService.formatDate(searchValue.deliveryTo);
      }
    }
    if (searchValue.creationFrom !== null && searchValue.creationFrom !== '') {
      query += '&createdOn=' + this.globalService.formatDate(searchValue.creationFrom);
      if (searchValue.creationTo !== null && searchValue.creationTo !== '') {
        query += '--' + this.globalService.formatDate(searchValue.creationTo);
      }
    }

    if (searchValue.status != null && searchValue.status !== '') {
      query += '&shipmentStatus=' + searchValue.status;
    }

    this.commonService.notifyOther({ option: 'shipment_search', value: query });

    this.closeit('');

  }

  closeit(event:any) {
    event;
    this.isShow = false;
    this.closeDialog();
  }

  reset() {
    this.searchForm.reset();
    this.globalSearch = '';
    this.searchGlobal();
    this.closeit('');
  }
closeDialog() {
  this.dateDialog =false;
  }
  checkDateValidation(fromDate:any, toDate:any, msg:any) {
   msg;
    if (fromDate > toDate) {
      this.dateDialog=true;
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


  searchGlobal() {
    let query = '';
    // if (this.globalSearch != null && this.globalSearch !== '') {
      query += '&filter=' + this.globalSearch.toString();
    // }
    this.commonService.notifyOther({ option: 'shipment_search', value: query });
    console.log('Here I am = ' + this.globalSearch);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
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
      this.closeit('');
    }
  }
  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if (!this.eRef.nativeElement.contains(event.target) && !event.target.classList.contains('ng-tns-c9-3')) {
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

  open_search() {
    this.isShow = !this.isShow;
  }

}
