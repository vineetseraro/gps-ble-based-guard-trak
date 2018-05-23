import { StringUtil } from './../../../core/string.util';
import { TagService } from './../shared/tag.service';
import { GlobalService } from '../../../core/global.service';
import { Tag, TagModel } from '../shared/tag.model';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, Message, SelectItem, SortMeta } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';
import { SearchService } from './../../../core/search.service';
import { DataTable } from 'primeng/components/datatable/datatable';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  providers: [TagService, GlobalService]
})
export class TagListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  tagModel: Observable<TagModel>;
  dataList: Tag[] = [];
  totalRecords = 0;
  metaData: SortMeta[];
  previousQuery: string;
  row = 0;
  attributetypes: SelectItem[];
  msgs: Message[] = [];
  activeStatus: SelectItem[];
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
   * Creates an instance of TagListComponent.
   * @param {TagService} tagService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @memberof TagListComponent
   */
  constructor(
    private tagService: TagService,
    private router: Router,
    private globalService: GlobalService,
    private searchService: SearchService
  ) { }

  /**
   * Init function
   * @memberof TagListComponent
   */
  ngOnInit() {
    this.loader = true;
     //// Search Service /////
     this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);        
        this.getTags(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
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
    this.getActiveStatus();
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
      let format = 'csv', entity = 'tags';
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
   * Load data for query
   * @param {LazyLoadEvent} event
   * @memberof TagListComponent
   */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getTags(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Function for add attribute
   * @memberof TagListComponent
   */
  public addTag() {
    this.router.navigate(['tags/add']);
  }


  /**
   * Edit function
   * @param {Attribute} dataRow
   * @memberof TagListComponent
   */
  public onEdit(dataRow: Tag) {
    this.router.navigate(['/tags', dataRow.id, 'edit']);
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getTags(query: string) {
    this.loader = true;
    this.tagService.getTags(query).subscribe((data:any) => {
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
   * Function for getting status
   * @memberof TagListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null });
    this.activeStatus.push({ label: 'Y', value: '1' });
    this.activeStatus.push({ label: 'N', value: '0' });
  }

  /**
   * Function for showing the error
   * @memberof TagListComponent
   */
  public showError(error: any) {
    this.msgs = [];
    error.data.forEach((element: any) => {
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
    });
  }
}
