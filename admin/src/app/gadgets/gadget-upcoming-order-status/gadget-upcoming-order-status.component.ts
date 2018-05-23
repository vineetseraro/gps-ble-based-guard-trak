import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../core/global.service';
import { SearchService } from '../../core/search.service';


@Component({
  selector: 'app-gadget-upcoming-order-status',
  templateUrl: './gadget-upcoming-order-status.component.html',
  styleUrls: ['./gadget-upcoming-order-status.component.css'],
  providers: [ReportService]
})
export class GadgetUpcomingOrderStatusComponent implements OnInit {
  graphData: Report[];
  casesPerHospital:BarChart[];
  loader = false;
  dateFormat: string;
  searchQuery = '';
  public isShow:boolean=false;
 
  
  constructor(private globalService: GlobalService, 
    private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    ///// Upcoming Case Status Report /////
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
    this.reportService.getGadgetData('case_status_between_date',searchQuery).subscribe((data:any) => {
      this.graphData = data.data;
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
