import { ViewChild } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { CategoryListModel, CategoryModel } from '../shared/category.model';
import { CategoryApiService } from '../shared/categoryapiservice';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryApiService]
})
export class CategoryListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  dataListModelObservable: Observable<CategoryListModel>;
  dataList: CategoryModel[];
  previousQuery = '';
  totalRecords = 0;
  activeStatus: SelectItem[];
  items: MenuItem[];
  loader = false;
  innerHeight: any;

  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  rows:any = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';

  /**
   * Creates an instance of CategoryListComponent.
   * @param {CategoryApiService} categaryApiService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @memberof CategoryListComponent
   */
  constructor(
    private categaryApiService: CategoryApiService,
    private router: Router,
    private globalService: GlobalService,
    private searchService: SearchService
  ) {}
  /**
   * On Init function
   * @memberof CategoryListComponent
   */
  ngOnInit() {
    this.loader = true;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getCategories(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.items = [
      {
        label: 'PDF Export',
        icon: 'fa-refresh',
        command: () => {
          this.export();
        }
      },
      {
        label: 'Excel Export',
        icon: 'fa-close',
        command: () => {
          this.export();
        }
      }
    ];
    this.rows = this.globalService.getLocalStorageNumRows();
    this.getActiveStatus();
    this.heightCalc();
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    console.log(this.innerHeight);
    this.innerHeight = this.innerHeight - 400 + 'px';
    console.log(this.innerHeight);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.innerHeight = event.target.innerHeight - 250 + 'px';
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
        entity = 'categories';
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
  /**
   * Add Category Function
   * @memberof CategoryListComponent
   */
  public addCategory() {
    this.router.navigate(['categories/add']);
  }
  /**
   * Function for editing the categories
   * @param {CategoryModel} dataRow
   * @memberof CategoryListComponent
   */
  public onEdit(dataRow: CategoryModel) {
    this.router.navigate(['/categories', dataRow.id, 'edit']);
  }
  /**
   * Function for deleting categories
   * @param {CategoryModel} dataRow
   * @memberof CategoryListComponent
   */
  public onDelete(dataRow: CategoryModel) {
    if (confirm('Are you sure you want to delete' + dataRow.name + '?')) {
      this.categaryApiService.remove(dataRow.id).subscribe(
       (data:any) => {
          data;
          this.router.navigate(['/contacts']);
        },
        (err:any) => {
          err;
          alert('Error in delete !!!');
        }
      );
    }
  }
  /**
   * Function for loading data of categories
   * @param {LazyLoadEvent} event
   * @memberof CategoryListComponent
   */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getCategories(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getCategories(query: string) {
    this.loader = true;
    this.categaryApiService.getCategories(query).subscribe(
     (data:any) => {
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
   * Function for getting the status
   * @memberof CategoryListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null });
    this.activeStatus.push({ label: 'Y', value: '1' });
    this.activeStatus.push({ label: 'N', value: '0' });
  }
}
