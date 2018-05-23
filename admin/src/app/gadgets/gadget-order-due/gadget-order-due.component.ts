import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';


@Component({
  selector: 'app-gadget-order-due',
  templateUrl: './gadget-order-due.component.html',
  styleUrls: ['./gadget-order-due.component.css'],
  providers: [ReportService]
})
export class GadgetOrderDueComponent implements OnInit {

  graphData: Report[];
  orderDue: BarChart[];
  loader = false;
  searchQuery = '';
  public isShow: boolean = false;

  constructor(private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    ///// Get Shipment Status Report /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'order_search') {
        this.searchQuery = res.value;
        this.getGraphData(this.searchQuery);
        return;
      }
    });
    this.getGraphData("");
  }

  getGraphData(searchQuery = "") {
    this.loader = true;
    this.reportService.getGadgetData('orders_due&ranges=0-3,3-7,7-14,14&unit=hours', searchQuery).subscribe((data: any) => {
      this.graphData = data.data;
      this.orderDue = [{
        key: 'Cumulative Return',
        values: this.graphData
      }];
      this.loader = false;
    });
  }
  show_search() {
    this.isShow = !this.isShow;
  }
  close_search() {
    this.isShow = false;
  }

}
