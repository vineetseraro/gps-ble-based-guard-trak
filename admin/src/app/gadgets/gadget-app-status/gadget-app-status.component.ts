import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-gadget-app-status',
  templateUrl: './gadget-app-status.component.html',
  styleUrls: ['./gadget-app-status.component.css'],
  providers: [ReportService]
})
export class GadgetAppStatusComponent implements OnInit {
  graphData: Report[];
  casesPerHospital: BarChart[];
  loader = false;
  searchQuery = '';
  public isShow: boolean = false;

  constructor(
    private reportService: ReportService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    ///// Upcoming Case Status Report /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'appstatus_search') {
        this.searchQuery = res.value;
        this.getGraphData(this.searchQuery);
        return;

      }
    });
    this.getGraphData("");
  }

  getGraphData(searchQuery = "") {
    this.loader = true;
    this.reportService.getGadgetData('app_status', searchQuery).subscribe((data: any) => {
      this.graphData = data.data;
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
