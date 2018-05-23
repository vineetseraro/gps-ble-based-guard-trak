import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gadget-beacon-model-distribution',
  templateUrl: './gadget-beacon-model-distribution.component.html',
  styleUrls: ['./gadget-beacon-model-distribution.component.css'],
  providers: [ReportService]
})
export class GadgetBeaconModelDistributionComponent implements OnInit {
  graphData: Report[];
  casesPerHospital: BarChart[];
  loader = false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    ///// Upcoming Case Status Report /////
    this.loader = true;
    this.reportService.getGraphData('beacons_per_beacontype').subscribe((data: any) => {
      this.graphData = data.data;
      this.loader = false;
    });
  }
}
