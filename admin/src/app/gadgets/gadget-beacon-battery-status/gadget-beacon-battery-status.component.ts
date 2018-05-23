import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gadget-beacon-battery-status',
  templateUrl: './gadget-beacon-battery-status.component.html',
  styleUrls: ['./gadget-beacon-battery-status.component.css'],
  providers: [ReportService]
})
export class GadgetBeaconBatteryStatusComponent implements OnInit {
  graphData: Report[];
  orderPerCity: BarChart[];
  loader = false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    ///// Get Shipment Status Report /////
    this.loader = true;
    this.reportService
      .getGraphData('beacons_per_batterylevel&ranges=-20,20-40,40-60,60-80,80&unit=percent')
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
