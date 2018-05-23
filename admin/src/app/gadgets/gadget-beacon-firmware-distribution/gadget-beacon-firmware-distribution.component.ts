import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gadget-beacon-firmware-distribution',
  templateUrl: './gadget-beacon-firmware-distribution.component.html',
  styleUrls: ['./gadget-beacon-firmware-distribution.component.css'],
  providers: [ReportService]
})
export class GadgetBeaconFirmwareDistributionComponent implements OnInit {
  graphData: Report[];
  casesPerHospital: BarChart[];
  loader = false;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    ///// Upcoming Case Status Report /////
    this.loader = true;
    this.reportService.getGraphData('beacons_per_firmware').subscribe((data: any) => {
      this.graphData = data.data;
      this.loader = false;
    });
  }
}
