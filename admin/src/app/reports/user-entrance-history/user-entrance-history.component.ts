import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { DeviceLocator } from '../shared/product.model';
import { ReportService } from '../shared/report.service';
import { UserService } from '../../masters/users/shared/user.service';
import { LocationService } from '../../masters/locations/shared/location.service';
import { ZoneService } from '../../masters/zones/shared/zone.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-userentrancehistory-list',
  templateUrl: './user-entrance-history.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [ReportService, GlobalService, UserService, LocationService, ZoneService]
})
export class UserEntranceHistoryComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  dataList: DeviceLocator[];
  dataRow: DeviceLocator;
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
  rows:any = '';
  emptyMessage = '';
  innerHeight: any;

  dt: string;
  userId:string;
  userData: any;
  userName: string;

  location: string;
  locationData: any;
  locationName: string;
  locationType: string;
  floorName: string;
  zoneName: string;
  displayExport = false;
  exportMessage = '';
  currentQuery : string;
  formatdt: string;
  userType : String = environment.userType

  /**
   * Creates an instance of UserEntranceHistoryComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof OrderListComponent
   */
  constructor(
    private reportService: ReportService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private userService: UserService,
    private locationService: LocationService,
    private zoneService: ZoneService
  ) {
  }


  /**
   * Init Method
   * @memberof UserEntranceHistoryComponent
   */
  public ngOnInit() {

    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);

      if (res.hasOwnProperty('option') && res.option === 'userentrancehistory_search') {
        // this.getProductTrackingList('?' + res.value);
        this.dataTableComponent.filters = res.value;
        this.dataTableComponent.onFilterKeyup('', '', 'Contains');
      }
    });

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('userId') && params.hasOwnProperty('dt') ) {
        this.userId = params['userId'];
        this.locationType = params['locationType'];
        this.location = params['location'];
        this.dt = params['dt'];
        this.formatdt = moment(params['dt']).format('DD MMM Y');

        this.userService.get(this.userId).subscribe((data:any) => {
          this.userData = data.data;
          this.userName = this.userData.given_name + ' ' + this.userData.family_name + ' [' + this.userData.email + ']';
        }, () => {
          // No Handling
        }, () => {
        });

        if (this.locationType === 'location') {
          this.locationService.get(this.location).subscribe((data:any) => {
            this.locationData = data.data;
            this.locationName = this.locationData.name;
            this.floorName = '--';
            this.zoneName = '--';
            
          }, () => {
            // No Handling
          }, () => {
          });
        } else if ( this.locationType === 'zone') {
          this.zoneService.get(this.location).subscribe((data:any) => {
            this.locationData = data.data;
            this.locationName = this.locationData.ancestors[1].name;
            this.floorName = this.locationData.ancestors[0].name;
            this.zoneName = this.locationData.name;
          }, () => {
            // No Handling
          }, () => {
          });
        }
      }
    });


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

  /**
   * Load the Order Data
   * @param {LazyLoadEvent} event
   * @memberof UserEntranceHistoryComponent
   */
  loadData(event: LazyLoadEvent) {
    this.currentQuery = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    if (this.currentQuery !== this.previousQuery) {
      /*const regex = new RegExp('\&timeFrom');
      if (regex.test(this.currentQuery) === false) {
        const startTime = moment().startOf('day').toISOString();
        const endTime = moment().endOf('day').toISOString();
        this.currentQuery += '&timeFrom=' + startTime + '&timeTo=' + endTime;
      }*/
      this.getUserEntranceList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof UserEntranceHistoryComponent
   */
  getUserEntranceList(query: string) {
    this.loader = true;
    this.reportService.userEntranceHistory(this.userId, this.locationType, this.location, this.dt, query).subscribe((data: any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list: any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};

        list[i].locationName = result[i].location.name;

        list[i].zoneName = '';
        if(result[i].location.zones) {
          list[i].zoneName = result[i].location.zones.name;
        }
        list[i].floorName = '';
        if(result[i].location.floor) {
          list[i].floorName = result[i].location.floor.name;
        }
        list[i].interval = result[i].interval;
        list[i].entryTime = result[i].entryTime;
        list[i].exitTime = result[i].exitTime;
        // list[i].dt = moment(result[i].dt).format('DD MMM Y');
      }

      this.dataList = list;
      this.totalRecords = data.totalRecords;
      this.loader = false;
    },
      (error: any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.setPageinationgMessage(0);
        }
        this.loader = false;
      });
  }

  setPageinationgMessage(listSize: number) {

    if (listSize !== 0) {
      this.endPageIndex = listSize + this.startPageIndex - 1;
    } else {
      this.startPageIndex = 0;
      this.endPageIndex = 0;
      this.totalRecords = 0;
    }
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }

  /**
   * Function for get product locator history for selected product
   * @param {ProductLocator} dataRow
   * @memberof UserEntranceHistoryComponent
   */
  public onHistory(dataRow: any) {
    console.log(dataRow);
    this.router.navigate(['/reports/entrancedetails', dataRow.user.id, dataRow.location.id, dataRow.dt]);
  }

   /**
   * Function for exporting the records
   * @memberof UserEntranceComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if ( this.totalRecords > 0) {
      let format = 'csv', entity = 'deviceLocator';
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
    //const self = this;
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }



}
