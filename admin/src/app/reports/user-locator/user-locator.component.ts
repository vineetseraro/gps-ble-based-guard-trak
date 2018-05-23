import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { EmployeeLocatorModel } from '../shared/employee.model';
import { ReportService } from '../shared/report.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-userlocator-list',
  templateUrl: './user-locator.component.html',
  providers: [ReportService, GlobalService]
})
export class UserLocatorComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  dataList: EmployeeLocatorModel[];
  dataRow: EmployeeLocatorModel;
  display = false;
  id = '';
  title = '';
  totalRecords = 0;
  activeStatus: SelectItem[];
  previousQuery: string;
  items: MenuItem[];
  loader = false;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  rows:any = '';
  emptyMessage = '';
  innerHeight: any;
  subscription: Subscription;

  cluster:any;
  lat = 28.6252;
  lng = 77.3732;
  zoom = 18;
  locations: any;
  isError = false;
  latlngbounds: any;
  knownLocations: any;
  unknownLocations: any;
  itemsMap: any;
  icons: any;
  map:any;
  displayExport = false;
  exportMessage = '';
  currentQuery : string;
  userType : String = environment.userType

  /**
   * Creates an instance of UserLocatorComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof OrderListComponent
   */
  constructor(
    private reportService: ReportService,
    private router: Router,
    private globalService: GlobalService,
    //private route: ActivatedRoute,
    private searchService: SearchService
  ) {
  }


  /**
   * Init Method
   * @memberof UserLocatorComponent
   */
  public ngOnInit() {

    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);

      if (res.hasOwnProperty('option') && res.option === 'userlocator_search') {
        // this.getProductTrackingList('?' + res.value);
        this.dataTableComponent.filters = res.value;
        this.dataTableComponent.onFilterKeyup('', '', 'Contains');
      }
    });

    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();

    this.heightCalc();
  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    this.innerHeight = (this.innerHeight - 400) + 'px';
  }

  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
    this.innerHeight = ((event.target.innerHeight) - 290) + 'px';
  }

  /**
   * Load the Order Data
   * @param {LazyLoadEvent} event
   * @memberof UserLocatorComponent
   */
  loadData(event: LazyLoadEvent) {
    this.currentQuery = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    console.log(this.currentQuery)

    if (this.currentQuery !== this.previousQuery) {
      this.getEmployeeLocatorList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof UserLocatorComponent
   */
  getEmployeeLocatorList(query: string) {
    this.loader = true;
    this.reportService.employeeLocator(query).subscribe((data:any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      

      const list:any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        
        list[i].empId = result[i].id;

        list[i].empName = result[i].name;

       // list[i].deviceCode = result[i].id;

        list[i].sensor = '';
        list[i].location = '';
        list[i].zone = '';
        list[i].lastTracked = '';
        list[i].Username = result[i].Username;

        if(result[i].device) {
          result[i].device.appName
          list[i].deviceApp = this.globalService.ifKeyExist(result[i].device, 'appName')?result[i].device.appName:'';
          list[i].deviceOS = this.globalService.ifKeyExist(result[i].device, 'os')?result[i].device.os:'';
          let deviceManf = '';
          deviceManf += this.globalService.ifKeyExist(result[i].device, 'manufacturer')?result[i].device.manufacturer + ' ' :'';
          deviceManf += this.globalService.ifKeyExist(result[i].device, 'model')?result[i].device.model + ' ':'';
          deviceManf += this.globalService.ifKeyExist(result[i].device, 'version')?result[i].device.version:'';
          list[i].deviceManf = deviceManf;
        }
        if (result[i].sensors) {
          list[i].sensor = result[i].sensors.code;
        }

        if (result[i].location.name !== null && result[i].location.name !== '') {
          list[i].location = result[i].location.name;
        } else {
          list[i].location = this.globalService.formatCommaSeperatedData([result[i].location.address,
          result[i].location.city,
          result[i].location.state,
          result[i].location.country]);
        }

        if (result[i].location.floor) {
          list[i].floor = result[i].location.floor.name;
        }

        if (result[i].location.zones) {
          list[i].zone = result[i].location.zones.name;
        }

        list[i].trackedAt = result[i].trackedAt;
      }

      this.dataList = list;
      this.totalRecords = data.totalRecords;
      this.loader = false;
    },
      (error:any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.setPageinationgMessage(0);
        }
        this.loader = false;
      });
  }

  setPageinationgMessage(listSize: number) {

    if (listSize !== 0) {
      this.endPageIndex = listSize + this.startPageIndex - 1;
    } else {
      this.startPageIndex = 0;
      this.endPageIndex = 0;
      this.totalRecords = 0;
    }
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }

  /**
   * Function for get product locator history for selected product
   * @param {UserLocatorComponent} dataRow
   * @memberof UserLocatorComponent
   */
  public onHistory(dataRow: any) {
    console.log(dataRow);
    this.router.navigate(['/reports/userlocatorhistory', dataRow.empId]);
  }

   /**
   * Function for exporting the records
   * @memberof UserLocatorComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if ( this.totalRecords > 0) {
      let format = 'csv', entity = 'userLocator';
      let queryObject = this.globalService.queryStringToObject(this.currentQuery);
      let userType = environment.userType +' Locator';
      this.globalService.export(format, entity, queryObject, {}, userType ).subscribe(
       (data:any) => {
          console.log(data);
          self.exportStatus(data.description);
        },
        (error:any) => {
          console.log(error);
          self.exportStatus(error.description);
        }
      );
    } else {
      statusMessage = 'No records to export';
      self.exportStatus(statusMessage)
    }
  }

  exportStatus(statusMessage:any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }



}
