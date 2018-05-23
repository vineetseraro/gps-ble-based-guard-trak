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
  selector: 'app-report-incident-report',
  templateUrl: './report-incident-report.component.html',
  styleUrls: ['./report-event-report.component.css'],
  providers: [ReportService, GlobalService]
})
export class ReportIncidentReportComponent implements OnInit, OnDestroy {
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
   * Creates an instance of ReportIncidentReportComponent.
   * @param {ReportService} reportService
   * @param {GlobalService} globalService
   * @memberof ReportIncidentReportComponent
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
   * @memberof ReportIncidentReportComponent
   */
  public ngOnInit() {
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'tourincidents_search') {
        this.isTableReset = true;
        this.getIncidentsList(this.currentQuery + res.value);
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
   * @memberof ReportIncidentReportComponent
   */
  loadData(event: LazyLoadEvent) {
    this.isTableReset = false;
    this.currentQuery = this.globalService.prepareQuery(event) + '&actionType=Incident' + this.searchQuery;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      this.getIncidentsList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof ReportIncidentReportComponent
   */
  public getIncidentsList(query: string) {
    this.loader = true;
    this.reportService.eventList(query).subscribe((data: any) => {
      // const result = data.data;
      let result = data.data;
      result = result.map((row) => {
        row.zone = '';
        if (typeof row.location.id !== 'undefined') {
          if (row.location.id === '') {
            if ( row.location.address !== ', , ,' ) {
              row.zone = row.location.address;
            } else {
              row.zone = this.globalService.formatLatLong(row.location.pointCoordinates.coordinates.reverse());
            }
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

  tourIncidentDetails(data: any) {
    this.router.navigate(['/reports/tourincidents/' + data.id]);
  }

  closeDetailsDialog() {
    this.eventdetails = [];
    this.displayDialog = false;
  }

  onRowSelectItems(event: any) {
    const selectedJsonObj = this.dataList.filter((row: any) => {
      console.log(row)
      console.log(event)
      if (row.id === event.data.id) {
        return true;
      } else {
        return false;
      }
    });
    console.log(selectedJsonObj);
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
    // this.selectedJson = selectedJsonObj[0];
    // console.log(this.selectedJson)
    this.displayDialog = true;
    console.log(event.data.pkid);
  }

  navigateToTourList () {
    this.router.navigate(['/reports/tourreport'], {queryParams: {referer: 'incidents'}});
  }

}
