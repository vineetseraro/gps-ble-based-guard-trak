import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-gadget-open-service-requests',
  templateUrl: './gadget-open-service-requests.component.html',
  styleUrls: ['./gadget-open-service-requests.component.css'],
  providers: [ReportService]
})
export class GadgetOpenServiceRequestsComponent implements OnInit {
  graphData: Report[];
  shipmentDue:BarChart[];
  loader = false;

  constructor(private reportService: ReportService) { }

  ngOnInit() {
     ///// Get Shipment Status Report /////
    this.loader = true;
    this.reportService.getGraphData('open_issues&ranges=0-3,3-7,7-14,14&unit=hours').subscribe((data:any) => {
      this.graphData = data.data;
      this.shipmentDue = [{
        key: 'Cumulative Return',
        values: this.graphData
      }];
      this.loader = false;
    });
    
  }
}
