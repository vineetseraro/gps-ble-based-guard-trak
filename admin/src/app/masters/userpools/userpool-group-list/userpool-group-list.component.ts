import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { StringUtil } from '../../../core/string.util';
import { UserPoolModel } from '../shared/userpool.model';
import { UserPoolGroupService } from '../shared/userpool.service';
import { SearchService } from './../../../core/search.service';

@Component({
  selector: 'app-userpool-group-list',
  templateUrl: './userpool-group-list.component.html',
  providers: [GlobalService]
})
export class UserPoolGroupListComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  userPoolModel: UserPoolModel;

  groupList = [];
  loader = false;
  msgs: Message[] = [];
  data: any;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  totalRecords = 0;
  previousQuery: string;
  row = 0;
  nextToken: string;
  emptyMessage = '';
  rows: any = '';
  gb = '';
  constructor(
    private router: Router,
    private userPoolGroupService: UserPoolGroupService,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private globalService: GlobalService
  ) {
    this.nextToken = '';
    this.totalRecords = 0;
  }

  /**
   * Load data for query
   * @param {LazyLoadEvent} event
   * @memberof UserPoolGroupListComponent
   */
  // loadData(event: LazyLoadEvent) {
  //   this.startPageIndex = event.first + 1;
  //   this.endPageIndex = event.first + event.rows;
  //   const currentQuery: string = this.globalService.prepareQuery(event);

  //   if (currentQuery !== this.previousQuery) {
  //     this.previousQuery = currentQuery;
  //   }
  // }

  /**
   * Get the list of all groups
   * @param {string} query
   * @memberof UserPoolGroupListComponent
   */
  public getGroups() {
    this.loader = true;
    const that = this;
    this.userPoolGroupService.listGroups({}, '').subscribe(
      res => {
        that.nextToken = res['NextToken'] ? res['NextToken'] : '';
        that.userPoolGroupService.groupsCount({}).subscribe(
          totalRecord => {
            that.totalRecords = totalRecord;
            that.groupList = res['Groups'];
            that.loader = false;
            that.emptyMessage = StringUtil.emptyMessage;
            that.setPageinationgMessage(that.groupList.length);
          },
          (err: any) => {
            that.groupList = [];
            that.previousQuery = '';
            that.loader = false;
            that.showError(err);
          }
        );
      },
      (err: any) => {
        that.groupList = [];
        that.previousQuery = '';
        that.loader = false;
        that.showError(err);
      }
    );
  }

  ngOnInit() {
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'groupList') {
        // console.log(this.dataTableComponent._totalRecords);

        this.loader = true;
        if (res.value.hasOwnProperty('type') && res.value.type === 'global') {
          this.dataTableComponent.globalFilter = res.value.filter;
          this.dataTableComponent._filter();
        } else {
          this.dataTableComponent.filters = res.value;
          this.dataTableComponent._filter();

          // this.dataTableComponent.onFilterKeyup('', '', 'Contains');
          // this.dataTableComponent.onFilterKeyup('AkAdmin', 'GroupName', 'Contains');
          // console.log(this.dataTableComponent.filteredValue);
          // { value: value, matchMode: matchMode }
        }
        this.setPageinationgMessage(this.dataTableComponent._totalRecords);
        this.loader = false;
      }
    });
    this.rows = this.globalService.getLocalStorageNumRows();
    if (this.rows === '100') {
      this.rows = '50';
    }
    this.getGroups();
  }

  /**
   * call on add group
   * @param {}
   * @memberof UserPoolGroupListComponent
   */
  public createGroup() {
    this.router.navigate(['addgroup'], { relativeTo: this.route });
  }

  /**
   * call on edit group
   * @param {object} dataRow
   * @memberof UserPoolGroupListComponent
   */
  public onEdit(dataRow: any) {
    this.router.navigate(['editgroup', dataRow.GroupName], { relativeTo: this.route });
  }

  /**
   * Function for showing the error
   * @memberof UserPoolGroupListComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  /**
   * Function to get pagination message
   * @memberof UserPoolGroupListComponent
   */
  setPageinationgMessage(listSize: number) {
    const page = this.dataTableComponent.page;
    const numRows = this.dataTableComponent.rows;
    const startPageIndex = page * numRows + 1;
    const endPageIndex = listSize + startPageIndex - 1;
    this.pagingmessage =
      'Showing ' + startPageIndex + ' to ' + endPageIndex + ' of ' + listSize + ' entries';
  }
}
