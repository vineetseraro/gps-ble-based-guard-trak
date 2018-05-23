import { Component, Input, OnInit } from '@angular/core';

declare let d3: any;

@Component({
  selector: 'app-d3donutchart',
  templateUrl: './d3donutchart.component.html',
  styleUrls: ['./d3donutchart.component.css']
})
export class D3donutchartComponent implements OnInit {

  @Input('height') height: any;
  @Input('width') width: any;
  @Input('data') data: any;
  @Input('api') api: any;
  options;
  chartType;

  constructor() { }

    ngOnInit(){
      
      if(this.height == null) {
        this.height = 320;
      }
      

      this.options = {
        chart: {
            type: 'pieChart',
            pie: {
                dispatch: {
                //chartClick: function(e:any) {console.log('chartClick')},
                elementClick: function(e:any) {
                  this.showReport(e);
                },
                //elementDblClick: function(e:any) {console.log('elementDblClick')},
                // elementMouseover: function(e:any) {console.log('elementMouseover')},
                // elementMouseout: function(e:any) {console.log('elementMouseout')},            
                }
            },
            tooltip: {
              "duration": 0,
              "gravity": "w",
              "distance": 25,
              "snapDistance": 0,
              "classes": null,
              "chartContainer": null,
              "enabled": true,
              "hideDelay": 200,
              "headerEnabled": false,
              "fixedTop": null,
              "offset": {
                "left": 0,
                "top": 0
              },
              "hidden": true,
              "valueFormatter" :function (d:any) { return d > 0 ? d : 0; },
              "data": null,
              "id": "nvtooltip-85819"
            },
            height: 320,
            donut: true,
            showControls: true, 
            showValues: true, 
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showLabels: false,
            valueFormat: function(d){
              return d3.format('')(d);
            },
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };
  }

  showReport(e) {
    console.log(e);
  }
}
