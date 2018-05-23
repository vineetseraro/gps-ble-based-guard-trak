import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, Message, SelectItem, SortMeta } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { StringUtil } from '../../../core/string.util';
import { Audittrail, AudittrailList } from '../shared/audittrail.model';
import { AudittrailService } from '../shared/audittrail.service';

@Component({
  selector: 'app-audittrail-list',
  templateUrl: './audittrail-list.component.html',
  styleUrls: ['./audittrail-list.component.scss'],
  providers: [AudittrailService, GlobalService]
})
export class AudittrailListComponent implements OnInit {
  audittrailList: Observable<AudittrailList>;
  datalist: Audittrail[] = [];
  totalRecords = 0;
  metaData: SortMeta[];
  previousQuery: string;
  row = 0;
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


  /**
   * Creates an instance of AudittrailListComponent.
   * @param {AudittrailService} audittrailService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @memberof AudittrailListComponent
   */

  constructor(
    private audittrailService: AudittrailService,
    private router: Router,
    private globalService: GlobalService,
  ) {

  }

  /**
   * Init function
   * @memberof AudittrailListComponent
   */
  ngOnInit() {
    this.loader = true;
    this.rows = this.globalService.getLocalStorageNumRows();
    this.heightCalc();
  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    this.innerHeight = (this.innerHeight - 400) + 'px';
  }

  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
    this.innerHeight = ((event.target.innerHeight) - 290) + 'px';
  }

  public export() {

  }
  /**
   * Load data for query
   * @param {LazyLoadEvent} event
   * @memberof AudittrailListComponent
   */
  loadData(event: LazyLoadEvent) {
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    const currentQuery: string = this.globalService.prepareQuery(event);
    if (currentQuery !== this.previousQuery) {
      this.getAudittrails(currentQuery);
      this.previousQuery = currentQuery;
    }
  }

  /**
   * Edit function
   * @param {Attribute} dataRow
   * @memberof AudittrailListComponent
   */
  public onView(dataRow: Audittrail) {
    this.router.navigate(['/audittrails', dataRow.id, 'view']);
  }

  /**
   * Get the list of all audittrails
   * @param {string} query
   * @memberof AudittrailListComponent
   */
  public getAudittrails(query: string) {
    this.loader = true;
    this.audittrailService.getAudittrails(query).subscribe((data:any) => {
      this.loader = false;
      this.datalist = data.data;
      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(this.datalist.length);
      this.emptyMessage = StringUtil.emptyMessage;
    },
    (error:any) => {
      this.loader = false;
      if (error.code === 210 || error.code === 404) {
        this.datalist = [];
        this.previousQuery = '';
      }
    });
  }

  /**
   * Function for showing the error
   * @memberof AudittrailListComponent
   */
  public showError(error: any) {
    this.msgs = [];
    error.data.forEach((element: any) => {
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
    });
  }

  setPageinationgMessage(listSize: number) {
    this.endPageIndex = listSize + this.startPageIndex - 1;
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }


}
