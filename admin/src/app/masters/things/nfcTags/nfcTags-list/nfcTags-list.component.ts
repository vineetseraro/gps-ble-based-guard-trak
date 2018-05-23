import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, Message } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { StringUtil } from '../../../../core/string.util';
import { NfcTags } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { SearchService } from './../../../../core/search.service';

@Component({
  selector: 'app-nfcTags-list',
  templateUrl: './nfcTags-list.component.html',
  providers: [GlobalService]
})
export class NfcTagsListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;

  previousQuery: string;
  loader = false;
  nfcTagsList: NfcTags[];
  totalRecords = 0;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  innerHeight: any;
  msgs: Message[] = [];
  rows: any = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';
  temperatureUnit = window.localStorage.getItem('temperatureUnit');

  constructor(
    private thingsService: ThingsService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.heightCalc();
    this.rows = this.globalService.getLocalStorageNumRows();
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'tempTagSearch') {
        // reset offset here
        console.log('came here');
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getCollectionList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        // this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    this.innerHeight = this.innerHeight - 400 + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = event.target.innerHeight - 290 + 'px';
  }

  /**
  * Load the Collection Data
  * @param {LazyLoadEvent} event
  * @memberof CollectionListComponent
  */
  loadData(event: LazyLoadEvent) {
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    const currentQuery: string = this.globalService.prepareQuery(event);
    if (currentQuery !== this.previousQuery) {
      this.getCollectionList(currentQuery);
      this.previousQuery = currentQuery;
    }
  }

  public onEdit(data: any) {
    // console.log("asdf");
    this.router.navigate(['edit', data.id], { relativeTo: this.route });
    return data;
  }

  /**
   * Collection Listing
   * @param {string} query
   * @memberof CollectionListComponent
   */
  public getCollectionList(query: string) {
    this.loader = true;
    this.thingsService.getAllNfcTags(query).subscribe(
      (data: any) => {
        console.log(data);
        this.nfcTagsList = data.data;
        if (this.temperatureUnit === 'fahrenheit') {
          this.nfcTagsList.map(dt => {
            dt.minTemp = this.globalService.convertCelsiusToFahrenheit(dt.minTemp);
            dt.maxTemp = this.globalService.convertCelsiusToFahrenheit(dt.maxTemp);
            return dt;
          });
        }
        this.totalRecords = data.totalRecords;
        this.setPageinationgMessage(this.nfcTagsList.length);
        this.loader = false;
        this.emptyMessage = StringUtil.emptyMessage;
      },
      (error: any) => {
        this.loader = false;
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.nfcTagsList = [];
          this.totalRecords = 0;
          this.setPageinationgMessage(this.nfcTagsList.length);
          this.previousQuery = '';
        }
      }
    );
  }

  // sync() {
  //   this.loader = true;
  //   const syncRequest: any = {};
  //   syncRequest.jobtype = 'beacon';
  //   this.thingsService.sync(syncRequest).subscribe(
  //    (data:any) => {
  //       console.log(data);
  //       this.loader = false;
  //       this.msgs = [];
  //       this.msgs.push({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Beacon Sync Scheduled Successfully'
  //       });
  //     },
  //     (error:any) => {
  //       this.loader = false;
  //       this.msgs = [];
  //       this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Some Error Occurred' });
  //     }
  //   );
  // }
  setPageinationgMessage(listSize: number) {
    if (listSize === 0) {
      this.pagingmessage = 'Showing 0 to 0 of 0 entries';
    }
    this.endPageIndex = listSize + this.startPageIndex - 1;
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
   * Function for add attribute
   * @memberof AttributeListComponent
   */
  public addNfcTag() {
    this.router.navigate(['add'], { relativeTo: this.route });
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
        entity = 'nfcTags';
      let queryObject = this.globalService.queryStringToObject(this.currentQuery);

      this.globalService.export(format, entity, queryObject).subscribe(
        (data: any) => {
          console.log(data);
          self.exportStatus(data.description);
        },
        (error: any) => {
          console.log(error);
          self.exportStatus(error.description);
        }
      );
    } else {
      statusMessage = 'No records to export';
      self.exportStatus(statusMessage);
    }
  }

  exportStatus(statusMessage: any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }
}
