import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
// import * as moment from 'moment';
import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { DeviceLocator } from '../shared/product.model';
import { ReportService } from '../shared/report.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-loginhistory-list',
  templateUrl: './login-history.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [ReportService, GlobalService]
})
export class LoginHistoryComponent implements OnInit {
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
  userType : String = environment.userType

  /**
   * Creates an instance of LoginHistoryComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof LoginHistoryComponent
   */
  constructor(
    private reportService: ReportService,
    // private router: Router,
    private globalService: GlobalService,
    //private route: ActivatedRoute,
    private searchService: SearchService
  ) {
  }


  /**
   * Init Method
   * @memberof LoginHistoryComponent
   */
  public ngOnInit() {

    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);

      if (res.hasOwnProperty('option') && res.option === 'loginhistory_search') {
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
   * @memberof LoginHistoryComponent
   */
  loadData(event: LazyLoadEvent) {
    this.currentQuery = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    
    if (this.currentQuery !== this.previousQuery) {
      /*const regex = new RegExp('\&timeFrom');
      if (regex.test(this.currentQuery) === false) {
        const startTime = moment().startOf('day').toISOString();
        const endTime = moment().endOf('day').toISOString();
        this.currentQuery += '&timeFrom=' + startTime + '&timeTo=' + endTime;
      }*/
      this.getLoginHistoryList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof LoginHistoryComponent
   */
  getLoginHistoryList(query: string) {
    this.loader = true;
    this.reportService.loginHistory(query).subscribe((data: any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list: any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        // console.log(result[i].user);
        list[i].userId = result[i].user.code;
        list[i].userName = result[i].user.name;
        list[i].deviceId = result[i].device.id;
        list[i].deviceCode = result[i].device.code;
        list[i].deviceName = result[i].device.name;
        list[i].app = result[i].device.appName;
        list[i].loginTime = result[i].loginTime;
        list[i].logoutTime = result[i].logoutTime;
      }

      this.dataList = list;
      this.totalRecords = data.totalRecords;
      this.loader = false;
    },
      (error: any) => {
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

}
