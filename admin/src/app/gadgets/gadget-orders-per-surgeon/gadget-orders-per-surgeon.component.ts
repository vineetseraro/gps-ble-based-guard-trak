import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-gadget-orders-per-surgeon',
  templateUrl: './gadget-orders-per-surgeon.component.html',
  styleUrls: ['./gadget-orders-per-surgeon.component.css'],
  providers: [ReportService]
})
export class GadgetOrdersPerSurgeonComponent implements OnInit {

  graphData: Report[];
  casesBySurgeon:BarChart[];
  loader = false;
  searchQuery = '';
  public isShow: boolean=false;

  constructor(private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    ///// Get Shipment Status Report /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'casespersurgery_search') {
        this.searchQuery = res.value;
        this.getGraphData(this.searchQuery);
        return;
      }
    });
    this.getGraphData("");
  }
  getGraphData(searchQuery = "") {
    this.loader = true;
    this.reportService.getGadgetData('cases_by_surgeon',searchQuery).subscribe((data:any) => {
      this.graphData = data.data;
      this.casesBySurgeon = [{
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
