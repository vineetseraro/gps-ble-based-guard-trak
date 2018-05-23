import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { GlobalService } from '../../../core/global.service';
import { DiagnosticsService } from '../shared/diagnostics.service';
import { PointLocationTracking } from '../shared/pointlocation-tracking.model';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';
import { PrettyPrintPipe } from '../../../core/pipes/pretty-print.pipe';


@Component({
  selector: 'app-pointstatustracking-list',
  templateUrl: './pointstatus-tracking.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [DiagnosticsService, GlobalService, PrettyPrintPipe]
})
export class PointStatusTrackingComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  @ViewChild('dt') public dataTable: DataTable;
  dataList: PointLocationTracking[];
  dataRow: PointLocationTracking;
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
  rows: any = '';
  emptyMessage = '';
  innerHeight: any;
  displayDialog: boolean;
  currentResults: any;
  selectedJson: any;
  currentQuery: string;
  searchQuery = '';
  isTableReset = false;

  /**
   * Creates an instance of PointStatusTrackingComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof OrderListComponent
   */
  constructor(
    private diagnosticsService: DiagnosticsService,
    // private router: Router,
    private globalService: GlobalService,
    // private route: ActivatedRoute,
    private searchService: SearchService
  ) {
  }


  /**
   * Init Method
   * @memberof PointStatusTrackingComponent
   */
  public ngOnInit() {
    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);
      if (res.hasOwnProperty('option') && res.option === 'diagnpointlocationtracking_search') {
        // this.getPointLocationTrackingList('?' + res.value);
        // this.dataTableComponent.filters = res.value;
        // this.dataTableComponent.onFilterKeyup('', '', 'Contains');
        this.isTableReset = true;
        this.currentQuery = '?offset=0&limit=1000';
        this.getPointStatusTrackingList(this.currentQuery + res.value);
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
  onResize(event: any) {
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
      this.getPointStatusTrackingList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof PointStatusTrackingComponent
   */
  getPointStatusTrackingList(query: string) {
    this.loader = true;
    this.diagnosticsService.pointStatusTracking(query).subscribe((data: any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list: any = [];
      this.currentResults = result;
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        list[i].sensors_uuid = result[i].sensors.uuid;
        list[i].sensors_maj = result[i].sensors.maj;
        list[i].sensors_min = result[i].sensors.min;
        list[i].sensors_rng = result[i].sensors.rng;
        list[i].lat = result[i].lat;
        list[i].lon = result[i].lon;
      
        if ( result[i].locationdetails[0] ) {
          if (result[i].locationdetails[0].locationId === null) {
            list[i].location = this.globalService.formatCommaSeperatedData([result[i].locationdetails[0].address,
            result[i].locationdetails[0].city,
            result[i].locationdetails[0].state,
            result[i].locationdetails[0].country]);
          } else {
            list[i].location = result[i].locationdetails[0].name;
          }
        } else {
          list[i].location = '';
        }
        console.log(result[i].sensors)

        if (typeof result[i].sensors.code !== 'undefined' && result[i].sensors.code !== null) {
          list[i].sensor = result[i].sensors.code + '[ ' + result[i].sensors.min + ' ]';
        } else {
          list[i].sensor = result[i].sensors.min;
        }

        list[i].acc = result[i].acc;
        list[i].spd = result[i].spd;
        list[i].alt = result[i].alt;
        list[i].dir = result[i].dir;
        list[i].ts = result[i].ts;
        // list[i].apihit = result[i].locStrmTm;
        list[i].apihit = null;
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
        if (result[i].discarded === true) {
          list[i].discarded = 'Discarded';
        } else {
          list[i].discarded = 'Accepted';
        }

        list[i].discardType = environment.discardReasons[result[i].discardType] || '';
      }
      if (this.isTableReset) {
        this.isTableReset = false;
        this.dataTable.reset();
      }
      this.dataList = this.globalService.cleanFormatResponse(list);
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

  closeDetailsDialog() {
    this.selectedJson = {};
    this.displayDialog = false;
  }

  onRowSelectItems(event: any) {
    //
    const selectedJsonObj = this.currentResults.filter((row: any) => {
      if (row.pkid === event.data.pkid) {
        return true;
      } else {
        return false;
      }
    });
    console.log(selectedJsonObj[0]);
    this.selectedJson = selectedJsonObj[0];
    console.log(this.selectedJson)
    this.displayDialog = true;
    console.log(event.data.pkid);
  }

}
