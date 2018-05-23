import { ViewChild } from '@angular/core';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';
import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { DeviceTourStats } from '../shared/employee.model';
import { ReportService } from '../shared/report.service';
import * as moment from 'moment';
import { UserService } from '../../masters/users/shared/user.service'
@Component({
  selector: 'app-guard-tour-stats-report',
  templateUrl: './report-guard-tour-stats.component.html',
  styleUrls: ['./report-guard-tour-stats.component.css'],
  providers: [ReportService, GlobalService, UserService]
})
export class ReportGuardTourStatsComponent implements OnInit, OnDestroy {
  @ViewChild('dt') public dataTable: DataTable;
  isTableReset = false;
  private subscription: Subscription;
  dataList: DeviceTourStats[];
  dataRow: DeviceTourStats;
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
  currentQuery: string;
  searchQuery = '';
  displayExport = false;
  exportMessage = '';
  displayDialog = false;
  eventdetails = [];
  range: string;
  tzoffset: number;
  allUsers: any;
  /**
   * Creates an instance of ReportGuardTourStatsComponent.
   * @param {ReportService} reportService
   * @param {GlobalService} globalService
   * @memberof ReportGuardTourStatsComponent
   */
  constructor(
    private reportService: ReportService,
    private globalService: GlobalService,
    private searchService: SearchService,
    private router: Router,
    private userService: UserService
  ) {
  }


  /**
   * Init Method
   * @memberof ReportGuardTourStatsComponent
   */
  public ngOnInit() {

    this.userService.listUsers('').subscribe(
      (data: any) => {
          this.allUsers = data.data;
      },
      (error: any) => {
          error;
      }
    );
    this.tzoffset = moment().utcOffset();

    this.range = 'all';

    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'guardtourstats_search') {

        this.dataTable.filters = res.value;
        this.dataTable.onFilterKeyup('', '', 'Contains');

        this.range = res.range;
      }
    });

    this.displayDialog = false
    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();
    this.heightCalc();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
   * @memberof ReportGuardTourStatsComponent
   */
  loadData(event: LazyLoadEvent) {
    this.currentQuery = this.globalService.prepareQuery(event);

    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getGuardTourStatsList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof ReportGuardTourStatsComponent
   */
  public getGuardTourStatsList(query: string) {
    this.loader = true;
    this.reportService.guardTourStatsList(query).subscribe((data: any) => {
      const result = data.data;
      this.totalRecords = data.totalRecords;
      this.setPageinationMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      this.dataList = result;
      this.totalRecords = data.totalRecords;
      this.loader = false;
    },
      (error: any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.setPageinationMessage(0);
        }
        this.loader = false;
      });
  }

  setPageinationMessage(listSize: number) {
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
   *
   *
   * @param {any} tourStatus
   * @param {any} data
   * @memberof ReportDeviceTourStatsComponent
   */
  navigateToTours(tourStatus: number, data: any) {
    const selUserObj = this.allUsers.filter( user => user.sub === data.attendee.uuid );
    const routes = ['/reports/tourreport'];
    let selUserId = '';
    if ( selUserObj.length ) {
      selUserId = selUserObj[0].id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        attendee: selUserId
      }
    };
    if ( tourStatus ) {
      navigationExtras.queryParams.tourStatus = tourStatus;
    }
    // get date filters
    const val = data.id;
    let tourStartFrom =  <any> '';
    let tourEndTo = <any> '';
    if ( this.range === 'day' ) {
      tourStartFrom = moment(val.year + '-' + val.month + '-' + val.day ).startOf('day'); // set to 12:00 am today
      tourEndTo = moment(val.year + '-' + val.month + '-' + val.day ).endOf('day'); // set to 23:59 pm today
    } else if ( this.range === 'week' ) {
      tourStartFrom = moment([val.year]).isoWeek(val.week).startOf('isoWeek');
      tourEndTo = moment([val.year]).isoWeek(val.week).endOf('isoWeek');
    } else if ( this.range === 'month' ) {
      tourStartFrom = moment(val.year + '-' + val.month + '-01' ).startOf('month');
      tourEndTo = moment(val.year + '-' + val.month + '-01' ).endOf('month');
    }
    if ( tourStartFrom && tourEndTo ) {
      navigationExtras.queryParams.tourStartFrom = this.globalService.formatDate(tourStartFrom);
      navigationExtras.queryParams.tourEndTo = this.globalService.formatDate(tourEndTo);
    }
    this.router.navigate(routes, navigationExtras);
  }

}
