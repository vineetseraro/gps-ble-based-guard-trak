import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { DeviceLocator } from '../shared/product.model';
import { ReportService } from '../shared/report.service';

@Component({
  selector: 'app-devicelocator-list',
  templateUrl: './device-locator.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [ReportService, GlobalService]
})
export class DeviceLocatorComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  dataList: DeviceLocator[];
  dataRow: DeviceLocator;
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

  /**
   * Creates an instance of DeviceLocatorComponent.
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
   * @memberof DeviceLocatorComponent
   */
  public ngOnInit() {

    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);

      if (res.hasOwnProperty('option') && res.option === 'devicelocator_search') {
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
   * @memberof DeviceLocatorComponent
   */
  loadData(event: LazyLoadEvent) {
    this.currentQuery = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    console.log(this.currentQuery)

    if (this.currentQuery !== this.previousQuery) {
      this.getDeviceLocatorList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof DeviceLocatorComponent
   */
  getDeviceLocatorList(query: string) {
    this.loader = true;
    this.reportService.deviceLocator(query).subscribe((data:any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      

      const list:any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        
        list[i].deviceId = result[i].id;

        list[i].deviceName = result[i].name;

        list[i].deviceCode = result[i].code;

        list[i].sensor = '';
        list[i].location = '';
        list[i].zone = '';
        list[i].lastTracked = '';

        list[i].deviceApp = result[i].attributes.appName;

        list[i].deviceOS = result[i].attributes.os;

        list[i].deviceApp = result[i].attributes.appName;

        list[i].deviceManf = result[i].attributes.manufacturer + ' ' + result[i].attributes.model + ' ' + result[i].attributes.version;

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
   * @param {ProductLocator} dataRow
   * @memberof ProductLocatorComponent
   */
  public onHistory(dataRow: any) {
    console.log(dataRow);
    this.router.navigate(['/reports/devicelocatorhistory', dataRow.deviceId]);
  }

   /**
   * Function for exporting the records
   * @memberof ProductListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if ( this.totalRecords > 0) {
      let format = 'csv', entity = 'deviceLocator';
      let queryObject = this.globalService.queryStringToObject(this.currentQuery);
      
      this.globalService.export(format, entity, queryObject).subscribe(
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
    //const self = this;
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }



}
