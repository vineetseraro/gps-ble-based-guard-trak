import { ViewChild } from '@angular/core';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { TourEvent } from '../shared/employee.model';
import { ReportService } from '../shared/report.service';

@Component({
  selector: 'app-report-event-report',
  templateUrl: './report-event-report.component.html',
  styleUrls: ['./report-event-report.component.css'],
  providers: [ReportService, GlobalService]
})
export class ReportEventReportComponent implements OnInit, OnDestroy {
  @ViewChild('dt') public dataTable: DataTable;
  isTableReset = false;
  private subscription: Subscription;
  dataList: TourEvent[];
  dataRow: TourEvent;
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
  showBackLink = false;
  /**
   * Creates an instance of ReportEventReportComponent.
   * @param {ReportService} reportService
   * @param {GlobalService} globalService
   * @memberof ReportEventReportComponent
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private globalService: GlobalService,
    private searchService: SearchService
  ) {
  }


  /**
   * Init Method
   * @memberof ReportEventReportComponent
   */
  public ngOnInit() {
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'tourevents_search') {
        this.isTableReset = true;
        this.getEventsList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
      }
    });
    this.subscription = this.route.queryParams.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('tourId')) {
          this.searchQuery += '&tourId=' + params['tourId'];
        }
        if (params.hasOwnProperty('actionType')) {
          this.showBackLink = true;
          this.searchQuery += '&actionType=' + params['actionType'];
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
   * @memberof ReportEventReportComponent
   */
  loadData(event: LazyLoadEvent) {
    this.isTableReset = false;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getEventsList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof ReportEventReportComponent
   */
  public getEventsList(query: string) {
    this.loader = true;
    this.reportService.eventList(query).subscribe((data: any) => {
      let result = data.data;
      result = result.map((row) => {
        row.zone = '';
        if (
          typeof row.location !== 'undefined' &&
          typeof row.location.floor !== 'undefined' &&
          typeof row.location.floor.zone !== 'undefined' &&
          typeof row.location.floor.zone.id !== 'undefined'
        ) {
          row.zone = row.location.floor.zone.name + ', ' + row.location.name;
        }
        // fall back for incident location
        if (
          !row.zone &&
          typeof row.location !== 'undefined' &&
          typeof row.location.id !== 'undefined'
        ) {
          if (row.location.id === '') {
            row.zone = row.location.address;
          } else {
            row.zone = row.location.name;
          }
        }
        return row;
      });
      this.totalRecords = data.totalRecords;
      this.setPageinationMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      this.dataList = result;
      this.totalRecords = data.totalRecords;
      if (this.isTableReset) {
        this.isTableReset = false;
        this.dataTable.reset();
      }
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

  tourEventDetails(data: any) {
    this.router.navigate(['/reports/tourevents/' + data.id]);
  }

  closeDetailsDialog() {
    this.eventdetails = [];
    this.displayDialog = false;
  }

  onRowSelectItems(event: any) {
    // console.log('IJNMHHHHN');
    const selectedJsonObj = this.dataList.filter((row: any) => {
      // console.log(row)
      // console.log(event)
      if (row.id === event.data.id) {
        return true;
      } else {
        return false;
      }
    });
    // console.log(selectedJsonObj);
    this.eventdetails = [
      { 'label': 'Schedule', 'value': selectedJsonObj[0].task.name, 'isImage': false },
      { 'label': 'Tour Id', 'value': selectedJsonObj[0].tour.id, 'isImage': false },
      { 'label': 'Guard', 'value': selectedJsonObj[0].attendee.fullName, 'isImage': false },
      { 'label': 'Location', 'value': selectedJsonObj[0].location.name, 'isImage': false },
      { 'label': 'Event', 'value': selectedJsonObj[0].action.actionType, 'isImage': false }
    ];

    switch (selectedJsonObj[0].action.actionType) {
      case 'Scan':
        this.eventdetails.push({
          'label': 'Sensor',
          'value': selectedJsonObj[0].additionalInfo.scan.sensor.name +
            ' ( ' + selectedJsonObj[0].additionalInfo.scan.sensor.code + ' )',
          'isImage': false
        });
        this.eventdetails.push({
          'label': 'Device',
          'value': selectedJsonObj[0].additionalInfo.scan.device.name +
            ' ( ' + selectedJsonObj[0].additionalInfo.scan.device.model + ' ' +
            selectedJsonObj[0].additionalInfo.scan.device.os + ' )',
          'isImage': false
        });
        break;
      case 'Incident':
        this.eventdetails.push({
          'label': 'Message',
          'value': selectedJsonObj[0].additionalInfo.incident.data, 'isImage': false
        });
        selectedJsonObj[0].additionalInfo.incident.images.forEach((imageRow) => {
          this.eventdetails.push({ 'label': 'Screenshot ', 'value': imageRow.url, 'isImage': true })
        });

        break;
      default:
        break;
    }

    // console.log(this.eventdetails);
    // this.selectedJson = selectedJsonObj[0];
    // console.log(this.selectedJson)
    this.displayDialog = true;
    // console.log(event.data.pkid);
  }

  navigateToTourList () {
    this.router.navigate(['/reports/tourreport'], {queryParams: {referer: 'events'}});
  }

}
