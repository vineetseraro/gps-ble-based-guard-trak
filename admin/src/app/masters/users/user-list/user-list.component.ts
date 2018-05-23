import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, Message, SelectItem } from 'primeng/primeng';

import { UserParametersService } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { UserModel } from '../shared/user.model';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';
import { UserService } from './../shared/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [GlobalService, UserService]
})
export class UserListComponent implements OnInit {
  // categoryListModelObservable:Observable<UserListModel>;
  userList: UserModel[];
  previousQuery: string;
  totalRecords: number;
  paginationToken: string;
  userStatus: SelectItem[];
  accountStatus: SelectItem[];
  loader = false;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  msgs: Message[] = [];
  userGroup = [];
  innerHeight: any;
  emptyMessage = '';
  // userCnt = 0;
  rows: any = '';

  currentQuery: string;
  searchQuery = '';
  displayExport = false;
  exportMessage = '';

  constructor(
    public userParams: UserParametersService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'userlist') {
        this.getUserList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
      }
    });
    this.paginationToken = '';
    this.totalRecords = 0;
    this.getUserStatus();
    this.getAccountStatus();
    this.heightCalc();
    this.startPageIndex = 1;
    this.rows = this.globalService.getLocalStorageNumRows();
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    this.innerHeight = this.innerHeight - 450 + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = event.target.innerHeight - 350 + 'px';
  }

  /**
   * Add users Function
   * @memberof UserListComponent
   */
  public addUser() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
  /**
   * Function for editing the users
   * @param {any} dataRow
   * @memberof UserListComponent
   */
  public onEdit(dataRow: any) {
    this.router.navigate(['edit', dataRow.sub], { relativeTo: this.route });
  }

  loadData(event: LazyLoadEvent) {
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getUserList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getUserList(query: string) {
    this.loader = true;
    this.userService.listUsers(query).subscribe(
     (data: any) => {
        data.data = (data.data || []).map(item => {
          item.displayGroup = item.groups.map(item => item.name).join(',');
          return item;
        });
        const result = data.data;
        this.totalRecords = data.totalRecords;
        this.setPageinationgMessage(data.data.length);
        this.emptyMessage = StringUtil.emptyMessage;
        this.userList = result;
        this.loader = false;
      },
      (error: any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.userList = [];
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
    if (listSize !== 0) {
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

  callbackWithParam(result: any, error: boolean) {
    if (error) {
      this.showError(result);
    }
    this.paginationToken = result.PaginationToken ? result.PaginationToken : '';
    const data = result.Users;
    this.userList = data;
    this.emptyMessage = StringUtil.emptyMessage;

    this.loader = false;
    this.setPaginationgMessage(this.userList.length);
  }

  /**
   * Function for getting status
   * @memberof UserListComponent
   */
  public getUserStatus() {
    this.userStatus = [];
    this.userStatus.push({ label: 'All', value: null });
    this.userStatus.push({ label: 'Y', value: '1' });
    this.userStatus.push({ label: 'N', value: '0' });
  }

  /**
   * Function for getting user status
   * @memberof UserListComponent
   */
  public getAccountStatus() {
    this.accountStatus = [];
    this.accountStatus.push({ label: 'All', value: null });
    this.accountStatus.push({ label: 'CONFIRMED', value: 'CONFIRMED' });
    this.accountStatus.push({ label: 'UNCONFIRMED', value: 'UNCONFIRMED' });
    this.accountStatus.push({ label: 'FORCE_CHANGE_PASSWORD', value: 'FORCE_CHANGE_PASSWORD' });
  }

  setPaginationgMessage(listSize: number) {
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
   * Function for showing the error
   * @memberof UserListComponent
   */
  public showError(error: any) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
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
      const format = 'csv', entity = 'users';
      const queryObject = this.globalService.queryStringToObject(this.currentQuery);

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
      self.exportStatus(statusMessage)
    }
  }

  exportStatus(statusMessage: any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }

}
