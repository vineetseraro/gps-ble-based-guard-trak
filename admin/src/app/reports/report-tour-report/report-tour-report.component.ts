import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { Order } from '../shared/order.model';
import { OrderService } from '../shared/order.service';

@Component({
  selector: 'app-report-tour-report',
  templateUrl: './report-tour-report.component.html',
  styleUrls: ['./report-tour-report.component.css'],
  providers: [OrderService, GlobalService]
})
export class ReportTourReportComponent implements OnInit, OnDestroy {
  @ViewChild('dt') public dataTable: DataTable;
  isTableReset = false;
  private subscription: Subscription;
  dataList: Order[];
  dataRow: Order;
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
  first = 0;
  ifNavigatingBack = false;
  public gridOptions = {
    first: 0,
    rows: 10,
    sortField: 'from',
    sortOrder: -1
  };
  currentQueryWOSearch: string;
  /**
   * Creates an instance of ReportTourReportComponent.
   * @param {OrderService} orderService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof ReportTourReportComponent
   */
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private searchService: SearchService
  ) {
  }

  onSort(e: { field: string, order: number }) {
    this.gridOptions.sortField = e.field;
    this.gridOptions.sortOrder = e.order;
    this.gridOptions.first = 0;
    window.localStorage.setItem('tour-options', JSON.stringify(this.gridOptions));
  }

  onPage(e: { first: number, rows: number }) {
    this.gridOptions.rows = e.rows;
    this.gridOptions.first = e.first;
    window.localStorage.setItem('tour-options', JSON.stringify(this.gridOptions));
  }

  /**
   * Init Method
   * @memberof ReportTourReportComponent
   */
  public ngOnInit() {
    this.ifNavigatingBack = false;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'tours_search') {
        this.isTableReset = true;
        const currentQueryWOSearch = this.currentQueryWOSearch.split('&');
        currentQueryWOSearch.forEach( (tmp, index) => {
          if ( tmp.search('offset=') !== -1 ) {
            const offset = tmp.split('offset=');
            this.startPageIndex = +offset[1] + 1;
            currentQueryWOSearch[index] = 'offset=0';
          }
        });
        this.currentQuery = '?' + currentQueryWOSearch.join('&');
        console.log('this.currentQuery');
        console.log(this.currentQuery);
        this.gridOptions.first = 0;
        this.saveStorage('tourSearch', res.value);
        this.getList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
      }
    });

    this.route.queryParams.subscribe(
      (params: any) => {
      if (params.hasOwnProperty('referer')) {
        this.ifNavigatingBack = true;
        const opt = window.localStorage.getItem('tour-options');
        this.searchQuery += window.localStorage.getItem('tourSearch');
        if (opt) {
          setTimeout(() => {
            this.gridOptions = JSON.parse(opt);
            this.gridOptions.first = 0;
            this.dataTable.sortField = this.gridOptions.sortField;
            this.dataTable.sortOrder = this.gridOptions.sortOrder;
            this.dataTable.sortSingle();
            this.dataTable.onPageChange(this.gridOptions);
          }, 1000);
        }
      }
      if (params.hasOwnProperty('deviceId')) {
        this.searchQuery += '&deviceId=' + params['deviceId'];
      }
      if (params.hasOwnProperty('attendee')) {
        this.searchQuery += '&attendee=' + params['attendee'];
      }
      if (params.hasOwnProperty('tourStatus')) {
        this.searchQuery += '&tourStatus=' + params['tourStatus'];
      }
      if (params.hasOwnProperty('tourStartFrom')) {
        this.searchQuery += '&tourStartFrom=' + params['tourStartFrom'];
      }
      if (params.hasOwnProperty('tourEndTo')) {
        this.searchQuery += '&tourEndTo=' + params['tourEndTo'];
      }
    });

    // check if navigated back from tour detail screen
    if ( !this.ifNavigatingBack ) {
      this.removeStorage('tourSearch');
    }

    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();
    this.gridOptions.rows = this.rows;
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
   * @memberof ReportTourReportComponent
   */
  loadData(event: LazyLoadEvent) {
    this.isTableReset = false;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.currentQueryWOSearch = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof ReportTourReportComponent
   */
  public getList(query: string) {
    this.loader = true;
    this.orderService.getReports('tours', query).subscribe((data: any) => {
      let result = data.data;
      result = result.map((row) => {
        switch (row.tourStatus) {
          case 30:
            row.statusIcon = 'assets/red-ball.png';
            break;
          case 20:
            row.statusIcon = 'assets/green-ball.png';
            break;
          case 10:
          default:
            row.statusIcon = 'assets/blue-ball.png';
            break;
        }
        return row;
      });

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      this.dataList = result;
      this.totalRecords = data.totalRecords;
      if (this.isTableReset) {
        this.isTableReset = false;
        // this.dataTable.reset();
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
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
  openReport(id: any) {
    this.router.navigate(['/orders/' + id + '/edit']);
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
   * Function for exporting the records
   * @memberof ReportTourReportComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if (this.totalRecords > 0) {
      const format = 'csv', entity = 'partialShipments';
      const queryObject = this.globalService.queryStringToObject(this.currentQuery);

      this.globalService.export(format, entity, queryObject).subscribe(
        (data: any) => {
          // console.log(data);
          self.exportStatus(data.description);
        },
        (error: any) => {
          // console.log(error);
          self.exportStatus(error.description);
        }
      );
    } else {
      statusMessage = 'No records to export';
      self.exportStatus(statusMessage)
    }
  }

  exportStatus(statusMessage: any) {
    // const self = this;
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }

  openTour (id) {
    this.saveStorage('tourSearch', this.searchQuery);
    this.router.navigate(['/reports/tourdetail/' + id]);
  }

  openEvent (id) {
    this.saveStorage('tourSearch', this.searchQuery);
    this.router.navigate(['/reports/tourevents'], {queryParams: {'tourId': id, 'actionType': 'Scan'}} );
  }

  openIncident (id) {
    this.saveStorage('tourSearch', this.searchQuery);
    this.router.navigate(['/reports/tourincidents'], {queryParams: {'tourId': id, 'actionType': 'Incident'}});
  }

  saveStorage(key, val, isObject = false): void {
    if ( isObject ) {
      val = JSON.stringify(val);
    }
    window.localStorage.setItem(key, val);
  }

  removeStorage(key): void {
    window.localStorage.removeItem(key);
  }

}
