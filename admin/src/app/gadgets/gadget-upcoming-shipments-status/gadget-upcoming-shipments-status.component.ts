import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../core/global.service';
import { SearchService } from '../../core/search.service';


@Component({
  selector: 'app-gadget-upcoming-shipments-status',
  templateUrl: './gadget-upcoming-shipments-status.component.html',
  styleUrls: ['./gadget-upcoming-shipments-status.component.css'],
  providers: [ReportService]
})
export class GadgetUpcomingShipmentsStatusComponent implements OnInit {
  graphData: Report[];
  loader = false;  
  dateFormat: string;
  searchQuery = '';
  public isShow: boolean = false;
  
  constructor(private globalService: GlobalService,
    private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    this.dateFormat = this.globalService.getCalenderDateFormat();
    ///// Get Shipment Status Report /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'shipment_search') {
        this.searchQuery = res.value;
        this.getGraphData(this.searchQuery);
        return;
      }
    });
    this.getGraphData("");
  }

  getGraphData(searchQuery = "") {
    this.loader = true;
    this.reportService.getGadgetData('shipment_status_between_date',searchQuery).subscribe((data:any) => {
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
