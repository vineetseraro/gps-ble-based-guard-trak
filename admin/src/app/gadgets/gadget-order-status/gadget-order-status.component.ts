import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';


@Component({
  selector: 'app-gadget-order-status',
  templateUrl: './gadget-order-status.component.html',
  styleUrls: ['./gadget-order-status.component.css'],
  providers: [ReportService]
})
export class GadgetOrderStatusComponent implements OnInit {

  graphData: Report[];
  loader = false;
  searchQuery = '';
  public isShow: boolean= false;
  
  constructor(private reportService: ReportService, private searchService: SearchService) { }


  ngOnInit() {
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
    this.reportService.getGadgetData('case_status',searchQuery).subscribe((data:any) => {
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
