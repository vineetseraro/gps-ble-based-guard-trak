import { ViewChild } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { Collection, CollectionModel } from '../shared/collection.model';
import { CollectionService } from '../shared/collection.service';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
  providers: [CollectionService, GlobalService]
})
export class CollectionListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  //// Variable Declaration ////
  collectionModel: Observable<CollectionModel>;
  dataList: Collection[];
  dataRow: Collection;
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
  innerHeight: any;
  rows:any = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';

  /**
   * Creates an instance of CollectionListComponent.
   * @param {CollectionService} collectionService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof CollectionListComponent
   */
  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private searchService: SearchService) {
  }


  /**
   * Init Method
   * @memberof CollectionListComponent
   */
  public ngOnInit() {
    this.loader = true;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);        
        this.getCollectionList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.getActiveStatus();
    this.items = [
      {
        label: 'PDF Export', icon: 'fa-refresh', command: () => {
          this.export();
        }
      },
      {
        label: 'Excel Export', icon: 'fa-close', command: () => {
          this.export();
        }
      },
    ];
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
   * Function for exporting the records
   * @memberof ProductListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if ( this.totalRecords > 0) {
      let format = 'csv', entity = 'collections';
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

  /**
   * Function for opening the Collection Add Form
   * @memberof CollectionListComponent
   */
  public addData() {
    this.router.navigate(['collections/add']);
  }

  /**
   * Collection Edit Function
   * @param {Collection} dataRow
   * @memberof CollectionListComponent
   */
  public onEdit(dataRow: Collection) {
    this.router.navigate([dataRow.id, 'edit'], { relativeTo: this.route });
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
      this.getCollectionList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getCollectionList(query: string) {
    this.loader = true;
    this.collectionService.getAll(query).subscribe((data:any) => {
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
  
  /**
   * Function for getting the status
   * @memberof CollectionListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null })
    this.activeStatus.push({ label: 'Y', value: '1' })
    this.activeStatus.push({ label: 'N', value: '0' })
  }
}
