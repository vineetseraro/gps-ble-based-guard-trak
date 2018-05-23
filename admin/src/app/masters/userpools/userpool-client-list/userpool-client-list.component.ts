import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { StringUtil } from '../../../core/string.util';
import { UserPoolClientService } from '../shared/userpool.service';
import { UserPoolClients } from './../shared/userpool.model';

@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-client-list.component.html',
  providers: [GlobalService]
})
export class UserPoolClientListComponent implements OnInit {

  clientList: UserPoolClients[] = [];
  loader = false;
  msgs: Message[] = [];
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  totalRecords = 0;
  previousQuery: string;
  row = 0;
  nextToken: string;
  emptyMessage = '';
  rows:any = '';

  constructor(
    private userPoolClientService: UserPoolClientService,
    private router: Router,
    private globalService: GlobalService,
  ) {
    this.nextToken = '';
    this.totalRecords = 0;
  }

  /**
   * Get the list of all groups
   * @param {string} query
   * @memberof UserPoolClientListComponent
   */
  public getClients(event) {
    this.loader = true;

    this.userPoolClientService.listUserPoolClients(event, this.nextToken).subscribe(res => {
      this.nextToken = (res['NextToken']) ? res['NextToken'] : '';
      const that = this;
      this.userPoolClientService.clientsCount().subscribe(totalRecord => {
        that.totalRecords = totalRecord;
        that.clientList = res['UserPoolClients'];
        that.loader = false;
        that.emptyMessage = StringUtil.emptyMessage;
        that.setPageinationgMessage(that.clientList.length);
      }, (err:any) => {
        that.showError(err);
      });
    }, (err:any) => {
      this.loader = false;
      this.clientList = [];
      this.previousQuery = '';
      this.showError(err);
    });
  }

  ngOnInit() {
    this.rows = this.globalService.getLocalStorageNumRows();
    if (this.rows === '100') {
      this.rows = '50';
    }
  }

  /**
   * Load data for query
   * @param {LazyLoadEvent} event
   * @memberof UserPoolClientListComponent
   */
  loadData(event: LazyLoadEvent) {
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    const currentQuery: string = this.globalService.prepareQuery(event);

    if (currentQuery !== this.previousQuery) {
      this.getClients(event);
      this.previousQuery = currentQuery;
    }
  }

  /**
   * Client Edit Function
   * @param {Client} dataRow
   * @memberof UserPoolClientListComponent
   */
  public onEdit(dataRow: UserPoolClients) {
    this.router.navigate(['/userpools/clients/edit', dataRow.UserPoolId, dataRow.ClientId]);
  }

  /**
   * Function to get pagination message
   * @memberof UserPoolGroupListComponent
   */
  setPageinationgMessage(listSize: number) {

    this.endPageIndex = listSize + this.startPageIndex - 1;
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }

  /**
   * Function for showing the error
   * @memberof UserPoolGroupListComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }


}
