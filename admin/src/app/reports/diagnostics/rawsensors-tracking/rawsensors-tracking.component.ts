import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { DiagnosticsService } from '../shared/diagnostics.service';
import { PointSensorTracking } from '../shared/pointsensor-tracking.model';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';


@Component({
  selector: 'app-rawsensorstracking-list',
  templateUrl: './rawsensors-tracking.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [DiagnosticsService, GlobalService]
})
export class RawSensorsTrackingComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild('dt') public dataTable: DataTable;
  dataList: PointSensorTracking[];
  dataRow: PointSensorTracking;
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
  currentQuery: string;
  searchQuery = '';
  isTableReset = false;

  /**
   * Creates an instance of PointSensorTrackingComponent.
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
   * @memberof RawSensorsTrackingComponent
   */
  public ngOnInit() {
    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);
      if (res.hasOwnProperty('option') && res.option === 'diagnpointsensortracking_search') {
        // this.getPointSensorTrackingList('?' + res.value);
        // this.dataTableComponent.filters = res.value;
        // this.dataTableComponent.onFilterKeyup('', '', 'Contains');
        this.isTableReset = true;
        this.currentQuery = '?offset=0&limit=1000';
        this.getRawSensorsTrackingList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
      }
    });

    this.loader = true;
    let numRows:any = window.localStorage.getItem('numRows');
    this.rows = numRows;
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
   * @memberof RawSensorsTrackingComponent
   */
  loadData(event: LazyLoadEvent) {
    this.isTableReset = false;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;

    if (this.currentQuery !== this.previousQuery) {
      this.getRawSensorsTrackingList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof RawSensorsTrackingComponent
   */
  getRawSensorsTrackingList(query: string) {
    this.loader = true;
    this.diagnosticsService.rawSensorsTracking(query).subscribe((data:any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list:any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        list[i].sensors_uuid = result[i].sensors.uuid;
        list[i].sensors_maj = result[i].sensors.maj;
        list[i].sensors_min = result[i].sensors.min;
        list[i].sensors_rng = result[i].sensors.rng;
        list[i].lat = result[i].lat;
        list[i].lon = result[i].lon;
        list[i].acc = result[i].acc;
        list[i].spd = result[i].spd;
        list[i].alt = result[i].alt;
        list[i].dir = result[i].dir;
        list[i].ts = result[i].ts;
        // list[i].apihit = result[i].locStrmTm;
        list[i].apihit = result[i].hit;
        // list[i].apihit = result[i].locStrmTm;
        list[i].logtime = null;
        list[i].battery = null;
        list[i].dt = result[i].dt;
        list[i].ble = null;
        list[i].gps = null;
        list[i].wifi = null;
        list[i].pkid = result[i].pkid;
        // console.log(result[i].did);
        list[i].did = result[i].did;
        list[i].message = null;
        list[i].ack = null;
      }
console.log(list);
      this.dataList = this.globalService.cleanFormatResponse(list);
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
