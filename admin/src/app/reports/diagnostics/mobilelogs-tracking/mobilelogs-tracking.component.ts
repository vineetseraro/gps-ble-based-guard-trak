import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { DiagnosticsService } from '../shared/diagnostics.service';
import { MobileLogsTracking } from '../shared/mobilelogs-tracking.model';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';


@Component({
  selector: 'app-mobilelogstracking-list',
  templateUrl: './mobilelogs-tracking.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [DiagnosticsService, GlobalService]
})
export class MobileLogsTrackingComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild('dt') public dataTable: DataTable;
  dataList: MobileLogsTracking[];
  dataRow: MobileLogsTracking;
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
  displayDialog: boolean;
  currentResults: any;
  selectedJson: any;
  currentQuery: string;
  searchQuery = '';
  isTableReset = false;


  /**
   * Creates an instance of MobileLogsTrackingComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof OrderListComponent
   */
  constructor(
    private diagnosticsService: DiagnosticsService,
    //private router: Router,
    private globalService: GlobalService,
    //private route: ActivatedRoute,
    private searchService: SearchService
  ) {
  }


  /**
   * Init Method
   * @memberof PointSensorTrackingComponent
   */
  public ngOnInit() {
    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);
      if (res.hasOwnProperty('option') && res.option === 'mobilelogs_search') {
        // this.getPointSensorTrackingList('?' + res.value);
        this.isTableReset = true;
        this.currentQuery = '?offset=0&limit=1000';
        this.getMobileLogsTrackingList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
      }
    });

    this.displayDialog = false;
    this.loader = true;
    this.currentResults = [];
    this.selectedJson = {};
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
   * @memberof PointSensorTrackingComponent
   */
  loadData(event: LazyLoadEvent) {
    this.isTableReset = false;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;

    if (this.currentQuery !== this.previousQuery) {
      this.getMobileLogsTrackingList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof MobileLogsTrackingComponent
   */
  getMobileLogsTrackingList(query: string) {
    this.loader = true;
    this.diagnosticsService.mobileLogsTracking(query).subscribe((data:any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list:any = [];
      for (let i = 0; i < result.length; i++) {
        /*let logts: any;
        logts = result[i].logts;
        if (!(result[i].logts == 'NA' || result[i].logts == '')) {
          logts = new Date(Number(result[i].logts));
        }*/
        list[i] = {};
        list[i].uuid = result[i].uuid;
        list[i].maj = result[i].maj;
        list[i].min = result[i].min;
        list[i].rng = result[i].rng;
        list[i].lat = result[i].lat;
        list[i].lon = result[i].lon;
        list[i].acc = result[i].acc;
        list[i].alt = result[i].alt;
        list[i].ts = result[i].ts === -99999 ? 0 : result[i].ts;
        list[i].localts = result[i].localts;
        list[i].mqttts = Number(result[i].mqttts) === -99999 ? 0 : Number(result[i].mqttts);
        list[i].logts = Number(result[i].logts) === -99999 ? 0 : Number(result[i].logts);
        list[i].battery = result[i].batt;
        list[i].dt = result[i].dt;
        list[i].ble = result[i].ble;
        list[i].gps = result[i].gps;
        list[i].wifi = result[i].wifi;
        list[i].pkid = result[i].pkid;
        // console.log(result[i].did);
        list[i].did = result[i].code;
        list[i].ack = result[i].ack;
        list[i].message = result[i].message;
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

    if (listSize != 0) {
      this.endPageIndex = listSize + this.startPageIndex - 1;
    } else {
      this.startPageIndex = 0;
      this.endPageIndex = 0;
      this.totalRecords = 0;
    }
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }

  loadComments(event:any) {
    event;
    //
  }

}
