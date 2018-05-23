import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../global.service';
import { SearchService } from '../../../search.service';


@Component({
  selector: 'app-search-locationzones',
  templateUrl: './locationzones.component.html',
  styleUrls: ['./locationzones.component.css']
})
export class LocationzonesComponent implements OnInit {

   searchForm: FormGroup; // our model driven form
   addressList: any;
   zoneList:any;
   floorList:any;
   public isShow:boolean = false;
   globalSearch:string;
   public globalSearchFocus: boolean = false;
   loader = false;
   dateFormat:string;

  constructor(
    private globalService: GlobalService,
    private commonService: SearchService,
    private fb: FormBuilder,
    private eRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data:any) => {
      this.addressList = this.globalService.prepareDropDown(data.data, 'Select Location');
    });
    
    this.searchForm = this.fb.group({
      'locationName': [''],
      'zoneName': [''],
      'floorName': ['']
    });

    // this.commonService.getSalesRepUsers('AkCarrier').subscribe((data:any) => {
    //   this.carrierUsers = data;
    // });
  }
    closeit(event:any) {
      event;
    this.isShow = false;
  }


  searchRecord(searchValue:any) {
    var query = "";
    if (searchValue.locationName != null && searchValue.locationName != "")
      query += "&location=" + searchValue.locationName;
    if (searchValue.zoneName != null && searchValue.zoneName != "")
      query += "&zone=" + searchValue.zoneName;
    if (searchValue.floorName != null && searchValue.floorName != "")
      query += "&floor=" + searchValue.floorName;
    this.commonService.notifyOther({ option: 'locationzones_search', value: query });
    this.closeit('');
  }

  fetchFloor(location) {
    this.loader = true;
    this.globalService.getDropdown('locations'+environment.serverEnv+'/'+location+'/floors').subscribe((data:any) => {
        this.floorList = this.globalService.prepareDropDown(data.data, 'Select Floors');
        this.loader = false;
    },
    (error:any) => {
      error;
      this.floorList = [ { "label": "No Floors Available", "value": null }]
      this.loader = false;
    });
  }

  fetchZone(floor) {
    this.loader = true;
    this.globalService.getDropdown('locations'+environment.serverEnv+'/floors/'+floor+'/zones').subscribe((data:any) => {
      this.zoneList = this.globalService.prepareDropDown(data.data, 'Select Check Point');
      this.loader = false;
    },
    (error:any) => {
      error;
      this.zoneList = [ { "label": "No Check Points Available", "value": null }]
      this.loader = false;
    });
  }

  searchGlobal() {
    var query = "";
    if (this.globalSearch != null && this.globalSearch != "")
      query += "&filter=" + this.globalSearch;
    this.commonService.notifyOther({ option: 'locationzones_search', value: query });
  }

  reset() {
    this.searchForm.reset();
    this.globalSearch = null;
    this.searchRecord('');
    this.closeit('');
  }


  /**
   * Get Shipment Status Dropdown 
   * @param {any} lists 
   * @returns 
   * @memberof GlobalService
   */
  getShipmentStatusDropDown() {
    const lists:any = {
        'Open' : 10,
        'Scheduled' : 20,
        'Partial Shipped' : 25,
        'Soft Shipped' : 30,
        'In Transit': 40
    };

    let attributes = [{ label: 'Select Shipment Status', value: null }];
    for (var key in lists) {
      attributes.push({ label: key, value: lists[key] });
    }
    return attributes;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE) {
      if (this.globalSearchFocus) {
        this.searchGlobal();
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
   open_search(){
    this.isShow= !this.isShow;
  }
}