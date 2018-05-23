import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-gadget-orders-per-hospital',
  templateUrl: './gadget-orders-per-hospital.component.html',
  styleUrls: ['./gadget-orders-per-hospital.component.css'],
  providers: [ReportService]
})
export class GadgetOrdersPerHospitalComponent implements OnInit {
  graphData: Report[];
  casesPerHospital:BarChart[];
  loader = false;
  searchQuery = '';
  public isShow: boolean= false;
  
  constructor(private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    ///// Get Shipment Status Report /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'casesperhospital_search') {
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
    this.casesPerHospital = [{
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
