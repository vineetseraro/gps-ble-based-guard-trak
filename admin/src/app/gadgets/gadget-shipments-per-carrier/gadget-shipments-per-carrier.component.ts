import { BarChart } from './../../masters/dashboard/shared/barchart.model';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../core/search.service';


@Component({
  selector: 'app-gadget-shipments-per-carrier',
  templateUrl: './gadget-shipments-per-carrier.component.html',
  styleUrls: ['./gadget-shipments-per-carrier.component.css'],
  providers: [ReportService]
})
export class GadgetShipmentsPerCarrierComponent implements OnInit {

  graphData: Report[];
  shipmentPerCarrier:BarChart[];
  loader = false;
  public isShow:boolean=false;
  searchQuery = '';
  constructor(private reportService: ReportService, private searchService: SearchService) { }

  ngOnInit() {
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
    this.reportService.getGadgetData('shipments_per_carrier',searchQuery).subscribe((data:any) => {
      this.graphData = data.data;
      this.shipmentPerCarrier = [{
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
