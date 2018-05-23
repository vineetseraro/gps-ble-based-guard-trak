import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { GlobalService } from '../../core/global.service';
import { SearchService } from '../../core/search.service';
import { StringUtil } from '../../core/string.util';
import { ProductService } from '../../masters/products/shared/product.service';
import { ProductLocator } from '../shared/product.model';
import { ReportService } from '../shared/report.service';

@Component({
  selector: 'app-productlocatorhistory-list',
  templateUrl: './product-locator-history.component.html',
  // styleUrls: ['./order-list.component.css'],
  providers: [ReportService, GlobalService, ProductService]
})
export class ProductLocatorHistoryComponent implements OnInit {
  @ViewChild(DataTable) dataTableComponent: DataTable;
  dataList: ProductLocator[];
  dataRow: ProductLocator;
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
  productId: string;
  productData: any;

  /**
   * Creates an instance of ProductTrackingComponent.
   * @param {DiagnosticsService} diagnosticsService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof OrderListComponent
   */
  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    //private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {
    this.productData = {};
  }


  /**
   * Init Method
   * @memberof ProductLocatorComponent
   */
  public ngOnInit() {

    this.searchService.notifyObservable$.subscribe((res) => {
      console.log(res.option);

      if (res.hasOwnProperty('option') && res.option === 'productlocatorhistory_search') {
        // this.getProductTrackingList('?' + res.value);
        this.dataTableComponent.filters = res.value;
        this.dataTableComponent.onFilterKeyup('', '', 'Contains');
      }
    });

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.productId = params['id'];

        this.productService.get(this.productId).subscribe((data:any) => {
          this.productData = data.data;
        }, () => {
          // No Handling
        }, () => {
        });
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
   * @memberof ProductLocatorComponent
   */
  loadData(event: LazyLoadEvent) {
    console.log(event);
    const currentQuery: string = this.globalService.prepareQuery(event);
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    console.log(currentQuery)

    if (currentQuery !== this.previousQuery) {
      this.getProductLocatorList(currentQuery);
      this.previousQuery = currentQuery;
    }
  }

  /**
   * Order Listing
   * @param {string} query
   * @memberof ProductLocatorComponent
   */
  getProductLocatorList(query: string) {
    this.loader = true;
    this.reportService.productLocatorHistory(this.productId, query).subscribe((data:any) => {
      const result = data.data;

      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;

      const list:any = [];
      for (let i = 0; i < result.length; i++) {
        list[i] = {};
        list[i].device = '';

        list[i].deviceCode = list[i].deviceName = list[i].deviceApp = '';
        list[i].sensor = '';
        list[i].location = '';
        list[i].zone = '';
        list[i].lastTracked = '';

        if (result[i].device) {
          list[i].deviceCode = result[i].device.code,
            list[i].deviceName = result[i].device.name,
            list[i].deviceApp = result[i].device.appName
        }

        if (result[i].sensors) {
          list[i].sensor = result[i].sensors.code;
        }

        if (result[i].location.addresses.name !== null && result[i].location.addresses.name !== '' ) {
          list[i].location = result[i].location.addresses.name;
        } else {
          list[i].location = this.globalService.formatCommaSeperatedData([result[i].location.addresses.address,
            result[i].location.addresses.city,
            result[i].location.addresses.state,
            result[i].location.addresses.country]);
        }

        if (result[i].location.addresses.zones) {
          list[i].zone = result[i].location.addresses.zones.name;
        }

        if (result[i].location.addresses.floor) {
          list[i].floor = result[i].location.addresses.floor.name;
        }

        list[i].lastTracked = result[i].trackedAt;
      }

      this.dataList = list;
      this.totalRecords = data.totalRecords;
      this.loader = false;
    },
      (error:any) => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.totalRecords = 0;
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

  loadComments(event:any) {
    event;
    //
  }

}
