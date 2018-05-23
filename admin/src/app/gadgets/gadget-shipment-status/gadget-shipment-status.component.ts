import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';

@Component({
  selector: 'app-gadget-shipment-status',
  templateUrl: './gadget-shipment-status.component.html',
  styleUrls: ['./gadget-shipment-status.component.css'],
  providers: [ReportService]
})
export class GadgetShipmentStatusComponent implements OnInit {

  graphData: Report[];
  loader = false;
  public isShow: boolean = false;
  searchQuery = '';
  constructor(private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
    ///// Get Shipment Status Report /////
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
    this.reportService.getGadgetData('shipment_status',searchQuery).subscribe((data:any) => {
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
