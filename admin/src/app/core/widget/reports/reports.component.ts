import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-reporting-tool',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})


export class ReportsComponent implements OnInit {

  @Input('data') data: any;
  
  cols: ReportColumns[] = [];
  
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['data']) {
           this.groupByCategory(this.data);
        }
    }

  groupByCategory(data: any) {
      if (!data) return;
      console.log('Keys Kaushal');
      const dataCols = Object.keys(this.data[0]);
      for (let column in dataCols) {
        this.cols.push({field: dataCols[column], header: dataCols[column]});
      }
      console.log(Object.keys(this.data[0]));
      return data;
  }

  ngOnInit() {
   
  }

}

export interface ReportColumns {
    field: string;
    header: string;
}
