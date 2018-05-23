import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, Message } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { Gateway } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { SearchService } from './../../../../core/search.service';
import { StringUtil } from './../../../../core/string.util';

@Component({
  selector: 'app-gateway-list',
  templateUrl: './gateway-list.component.html',
  providers: [GlobalService]
})
export class GatewayListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  previousQuery: string;
  loader = false;
  dataList: Gateway[];
  totalRecords = 0;
  msgs: Message[] = [];
  innerHeight: any;
  currentQuery: string;
  startPageIndex = 1;
  endPageIndex = 10;
  searchQuery = '';
  pagingmessage = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';

  rows:any = '';
  emptyMessage = '';

  constructor(private thingsService: ThingsService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private searchService: SearchService) {
  }

  ngOnInit() {
    this.loader = true;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);        
        this.getGatewayList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.heightCalc();
    this.rows = this.globalService.getLocalStorageNumRows();

  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    this.innerHeight = (this.innerHeight - 400) + "px";
  }

  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
    this.innerHeight = ((event.target.innerHeight) - 290) + "px";
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
      this.getGatewayList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }
  
  public onEdit(data: any) {
    // console.log("asdf");
    this.router.navigate(['edit', data.id], { relativeTo: this.route });
    return data;
  }

  public addData() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getGatewayList(query: string) {
    this.loader = true;
    this.thingsService.getAllGateways(query).subscribe((data:any) => {
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
      });
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
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }

  sync() {
    this.loader = true;
    const syncRequest: any = {};
    syncRequest.jobtype = 'gateway';
    this.thingsService.sync(syncRequest).subscribe((data:any) => {
      console.log(data);
      this.loader = false;
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Gateway Sync Scheduled Successfully' });
    },
      (error:any) => {
        error;
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Some Error Occurred' });
      });
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
      let format = 'csv', entity = 'gateways';
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
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }

}
