import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { Zone, ZoneModel } from '../shared/zone.model';
import { ZoneService } from '../shared/zone.service';
import { SearchService } from './../../../core/search.service';
import { StringUtil } from './../../../core/string.util';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css'],
  providers: [ZoneService, GlobalService]
})
export class ZoneListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  //// Variable Declaration ////
  zoneModel: Observable<ZoneModel>;
  dataList: Zone[];
  dataRow: Zone;
  display = false;
  id = '';
  title = '';
  totalRecords = 0;
  activeStatus: SelectItem[];
  previousQuery: string;
  items: MenuItem[];
  loader = false;
  innerHeight: any;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  rows: any = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';
  proxMap = false;
  proxData: any = { totalRecords: 0, data: { '0': [], '1': [], '2': [], '3': [] } };
  showProxProductList = false;
  proxProductList = '';
  stroke = [
    { width: 20, style: 0xff0000 },
    { width: 30, style: 0x00ff00 },
    { width: 50, style: 0x0000ff }
  ];
  selectedZone = '';
  selectedFloor = '';
  selectedLocation = '';

  // public pixelHitArea = hitAreas.PixelHitArea;
  /**
   * Creates an instance of ZoneListComponent.
   * @param {ZoneService} zoneService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof ZoneListComponent
   */
  constructor(
    private zoneService: ZoneService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  /**
   * Init Method
   * @memberof ZoneListComponent
   */
  public ngOnInit() {
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'simple_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getZoneList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.getActiveStatus();
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
    this.heightCalc();
    this.rows = this.globalService.getLocalStorageNumRows();
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
   * Function for exporting the records
   * @memberof ProductListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if (this.totalRecords > 0) {
      let format = 'csv',
        entity = 'zones';
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

  /**
   * Function for opening the Zone Add Form
   * @memberof ZoneListComponent
   */
  public addData() {
    this.router.navigate(['zones/add']);
  }

  /**
   * Zone Edit Function
   * @param {Zone} dataRow
   * @memberof ZoneListComponent
   */
  public onEdit(dataRow: Zone) {
    this.router.navigate([dataRow.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Load the Zone Data
   * @param {LazyLoadEvent} event
   * @memberof ZoneListComponent
   */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getZoneList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }
  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getZoneList(query: string) {
    this.loader = true;
    this.zoneService.getAll(query).subscribe(
      (data: any) => {
        const result = data.data;
        this.totalRecords = data.totalRecords;
        this.setPageinationgMessage(data.data.length);
        this.emptyMessage = StringUtil.emptyMessage;
        this.dataList = result;
        this.loader = false;
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
   * Function for getting status
   * @memberof AttributeListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null });
    this.activeStatus.push({ label: 'Y', value: '1' });
    this.activeStatus.push({ label: 'N', value: '0' });
  }
  public productList(data: any) {
    this.proxMap = true;
    this.loader = true;
    this.selectedZone = data.id;
    this.selectedFloor = data.ancestors[0].id;
    this.selectedLocation = data.ancestors[1].id;
    this.zoneService.getProductsinZone(this.selectedZone).subscribe(
      (data: any) => {
        const result = data;
        console.log(result);
        this.proxData = result;
        this.loader = false;
      },
      (error: any) => {
        console.log(error);
        if (error.code === 210 || error.code === 404) {
        }
        this.loader = false;
      }
    );
  }
  public onProxClick(rng: any) {
    const searchObj: any = {};
    searchObj.location = this.selectedLocation;
    searchObj.floor = this.selectedFloor;
    searchObj.zone = this.selectedZone;
    searchObj.rng = rng;

    this.router.navigate(['/reports/productlocator']);
    setTimeout(() => {
      this.searchService.notifyOther({
        option: 'productlocator_route_search',
        value: searchObj
      });
    }, 0);
  }
}
