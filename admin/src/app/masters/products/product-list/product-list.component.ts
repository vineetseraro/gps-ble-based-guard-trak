import { Component, HostListener, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { StringUtil } from '../../../core/string.util';
import { Product, ProductModel } from '../shared/product.model';
import { ProductService } from '../shared/product.service';
import { SearchService } from './../../../core/search.service';
import { ThingsService } from './../../things/shared/things.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService, GlobalService]
})
export class ProductListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  //// Variable Declaration ////
  productModel: Observable<ProductModel>;
  dataList: Product[];
  dataRow: Product;
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
  innerHeight: any;
  rows: any = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  eventObj: any;
  displayExport = false;
  exportMessage = '';
  graph: boolean = false;
  linechartData: any = [];
  temperatureUnit = window.localStorage.getItem('temperatureUnit');
  extraOptions: any = {};

  /**
   * Creates an instance of ProductListComponent.
   * @param {ProductService} productService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof ProductListComponent
   */
  constructor(
    private productService: ProductService,
    private router: Router,
    private globalService: GlobalService,
    private thingService: ThingsService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  /**
   * Init Method
   * @memberof ProductListComponent
   */
  public ngOnInit() {
    this.loader = true;

    this.extraOptions.xLabel = 'Time';
    if (this.temperatureUnit === 'fahrenheit') {
      this.extraOptions.yLabel = 'Temperature(F)';
    } else {
      this.extraOptions.yLabel = 'Temperature(C)';
    }

    //// Search Service /////
    this.searchService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty('option') && res.option === 'product_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getProductList(this.currentQuery + res.value);
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
    console.log('storage value ' + window.localStorage.getItem('numRows'));
    this.linechartData = [];
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
        entity = 'products';
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

  /**
   * Function for opening the Product Add Form
   * @memberof ProductListComponent
   */
  public addData() {
    this.router.navigate(['products/add']);
  }

  /**
   * Product Edit Function
   * @param {Product} dataRow
   * @memberof ProductListComponent
   */
  public onEdit(dataRow: Product) {
    this.router.navigate([dataRow.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Product Delete Function
   * @param {Product} dataRow
   * @memberof ProductListComponent
   */
  public onDelete(dataRow: Product) {
    if (confirm('Are you sure you want to delete ' + dataRow.name + '?')) {
      this.productService.remove(dataRow.id).subscribe(
        (data: any) => {
          data;
          this.router.navigate(['/contacts']);
        },
        (err: any) => {
          err;
          alert('Error in delete !!!');
        }
      );
    }
  }

  /**
   * Load the Product Data
   * @param {LazyLoadEvent} event
   * @memberof ProductListComponent
   */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getProductList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Get Listing
   * @param {string} query
   * @memberof ProductListComponent
   */
  public getProductList(query: string) {
    this.loader = true;
    this.productService.getAll(query).subscribe(
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
   * Function for getting the status
   * @memberof ProductListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null });
    this.activeStatus.push({ label: 'Y', value: '1' });
    this.activeStatus.push({ label: 'N', value: '0' });
  }

  exportStatus(statusMessage: any) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }
  getTempData(productId) {
    this.loader = true;
    this.thingService.getProductTemperatureData(productId).subscribe((data: any) => {
      let tempData = data.data;
      var max = [],
        min = [],
        waves = [];

      tempData.forEach(arr => {
        arr.forEach(data => {
          let stTime = data.startTime;
          let endTime = data.endTime == 0 ? new Date() : data.endTime;
          const c = data.cycle * 1000;
          const temp: any = {};
          if (this.temperatureUnit === 'fahrenheit') {
            this.extraOptions.yLabel = 'Temperature(F)';
            data.minTemp = this.globalService.convertCelsiusToFahrenheit(data.minTemp);
            data.maxTemp = this.globalService.convertCelsiusToFahrenheit(data.maxTemp);
          }
          const maxTemp = data.maxTemp;
          const minTemp = data.minTemp;

          max.push({ x: stTime, y: maxTemp });
          max.push({ x: endTime, y: maxTemp });
          min.push({ x: stTime, y: minTemp });
          min.push({ x: endTime, y: minTemp });

          temp.key = data.sensor.name;
          temp.color = '#7777ff';
          temp.values =
            (data.temp || []).map((element: any) => {
              stTime += c;
              if (this.temperatureUnit === 'fahrenheit') {
                element = this.globalService.convertCelsiusToFahrenheit(element);
              }
              return { x: stTime, y: element };
            }) || [];

          if (data.locationTracking.length > 0) {
            console.log('in data location tracking');
            console.log(data.locationTracking);
            const scanLoc: any = {};
            scanLoc.key = 'Scan Location';
            scanLoc.color = '#000000';

            scanLoc.values =
              (data.locationTracking || []).map((element: any) => {
                return { x: element.ts, y: minTemp - 10 };
              }) || [];
            waves.push(scanLoc);
          }
          console.log(waves);
          waves.push(temp);
        });
      });
      //Line chart data should be sent as an array of series objects.
      this.linechartData = [
        {
          values: max, //values - represents the array of {x,y} data points
          key: 'Max Temperature', //key  - the name of the series.
          color: '#ff7f0e' //color - optional: choose your own line color.
        },
        {
          values: min,
          key: 'Min Temperature',
          color: '#2ca02c'
        }
      ].concat(waves);
      this.graph = true;
      this.loader = false;
    });
  }
}
