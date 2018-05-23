import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, Message } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { StringUtil } from '../../../../core/string.util';
import { Beacon } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';




@Component({
  selector: 'app-beacon-list',
  templateUrl: './beacon-list.component.html',
  providers: [GlobalService]
})
export class BeaconListComponent implements OnInit {

  previousQuery: string;
  loader = false;
  beaconList: Beacon[];
  totalRecords = 0;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  innerHeight: any;

  msgs: Message[] = [];
  rows:any = '';
  emptyMessage = '';
  displayExport = false;
  exportMessage = '';
  currentQuery: string;



  constructor(private thingsService: ThingsService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loader = true;
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
    this.thingsService.getAllBeacons(query).subscribe((data:any) => {
      console.log(data);
      this.beaconList = data.data;
      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(this.beaconList.length);
      this.loader = false;
      this.emptyMessage = StringUtil.emptyMessage;

    },
      (error:any) => {
        this.loader = false;
        if (error.code === 210) {
          this.beaconList = [];
          this.previousQuery = '';
        }
      });
  }

  sync() {
    this.loader = true;
    const syncRequest: any = {};
    syncRequest.jobtype = 'beacon';
    this.thingsService.sync(syncRequest).subscribe((data:any) => {
      console.log(data);
      this.loader = false;
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Beacon Sync Scheduled Successfully' });
    },
      (error:any) => {
        error;
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Some Error Occurred' });
      });
  }
  setPageinationgMessage(listSize: number) {

    this.endPageIndex = listSize + this.startPageIndex - 1;
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
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
      let format = 'csv', entity = 'beacons';
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
