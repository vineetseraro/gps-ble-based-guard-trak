import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gadget-beacon-last-seen',
  templateUrl: './gadget-beacon-last-seen.component.html',
  styleUrls: ['./gadget-beacon-last-seen.component.css'],
  providers: [ReportService]
})
export class GadgetBeaconLastSeenComponent implements OnInit {
  graphData: Report[];
  orderPerCity: BarChart[];
  loader = false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    ///// Get Shipment Status Report /////
    this.loader = true;
    this.reportService
      .getGraphData('beacons_per_lastconnection&unit=hours&ranges=-3,3-8,8-16,16-24,24-72,72-168')
      .subscribe((data: any) => {
        this.graphData = data.data;
        this.orderPerCity = [
          {
            key: 'Cumulative Return',
            values: this.graphData
          }
        ];
        this.loader = false;
      });
  }
}
