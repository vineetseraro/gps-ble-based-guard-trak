import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from './../../../notifications/shared/notification.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, Message } from 'primeng/primeng';
import { environment } from '../../../../../environments/environment';

import { GlobalService } from '../../../../core/global.service';
import { StringUtil } from '../../../../core/string.util';
import { Apps } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { SearchService } from './../../../../core/search.service';

@Component({
  selector: 'app-gateway-list',
  templateUrl: './app-gateway-list.component.html',
  providers: [GlobalService]
})
export class AppGatewayListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  previousQuery: string;
  loader = false;
  dataList: Apps[];
  totalRecords = 0;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  msgs: Message[] = [];
  rows:any = '';
  innerHeight: any;
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';
  gatewayFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private thingsService: ThingsService,
    private router: Router,
    private globalService: GlobalService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loader = true;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getAppsList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.heightCalc();
    this.rows = this.globalService.getLocalStorageNumRows();
    this.gatewayFormGroup = this.fb.group({});
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    this.innerHeight = this.innerHeight - 400 + 'px';
  }

  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
    this.innerHeight = event.target.innerHeight - 290 + 'px';
  }

  /**
  * Load the Collection Data
  * @param {LazyLoadEvent} event
  * @memberof CollectionListComponent
  */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getAppsList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  public onEdit(data: any) {
    // console.log("asdf");
    this.router.navigate(['edit', data.id], { relativeTo: this.route });
    return data;
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getAppsList(query: string) {
    this.loader = true;
    this.thingsService.getAllApps(query).subscribe((data:any) => {
      const result = data.data;
      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      this.dataList = result;
      this.loader = false;
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
      }
    );
  }
  /** 
   * Set Pagination Message
   */
  setPageinationgMessage(listSize: number) {
    if (listSize != 0) {
      this.endPageIndex = listSize + this.startPageIndex - 1;
    } else {
      this.startPageIndex = 0;
      this.endPageIndex = 0;
      this.totalRecords = 0;
    }
    this.pagingmessage =
      'Showing ' +
      this.startPageIndex +
      ' to ' +
      this.endPageIndex +
      ' of ' +
      this.totalRecords +
      ' entries';
  }

  /**
   * Function for exporting the records
   * @memberof ProductListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if (this.totalRecords > 0) {
      let format = 'csv',
        entity = 'devices';
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
      self.exportStatus(statusMessage);
    }
  }

  exportStatus(statusMessage:any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }
  testNotify(deviceCode) {
    this.loader = true;

    this.notificationService.testNotify(deviceCode).subscribe(
     (data:any) => {
        this.loader = false;
        if (data.code === 202) {
          this.showSuccess('Test Notification sent successfully to: ' + deviceCode);
        }
      },
      (error:any) => this.showError(error)
    );
  }
  public showError(error: any) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error', detail: error.message });
    setTimeout(() => {}, environment.successMsgTime);
  }
  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {}, environment.successMsgTime);
  }
}
