import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-gadget-orders-per-sales-rep',
  templateUrl: './gadget-orders-per-sales-rep.component.html',
  styleUrls: ['./gadget-orders-per-sales-rep.component.css'],
  providers: [ReportService]
})
export class GadgetOrdersPerSalesRepComponent implements OnInit {

  graphData: Report[];
  casesPerSalesRep:BarChart[];
  loader = false;
  searchQuery = '';
  public isShow:boolean=false;
  
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
    this.reportService.getGadgetData('case_per_sales_rep',searchQuery).subscribe((data:any) => {
      this.graphData = data.data;
      this.casesPerSalesRep = [{
        key: 'Cumulative Return',
        values: this.graphData
      }];
      this.loader = false;
    });
  }
  show_search() {
    this.isShow = !this.isShow;
  }
  close_search(){
    this.isShow = false;
  }

}
