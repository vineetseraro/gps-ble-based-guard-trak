import { Component, Input, OnInit } from '@angular/core';

declare let d3: any;

@Component({
  selector: 'app-d3barchart',
  templateUrl: './d3barchart.component.html',
  styleUrls: ['./d3barchart.component.css']
})
export class D3barchartComponent implements OnInit {
  @Input('height') height: any;
  @Input('width') width: any;
  @Input('data') data: any;
  options:any;
  chartType:any;

  constructor() {}

  ngOnInit() {
    if (this.height == null) {
      this.height = 320;
    }

    this.options = {
      chart: {
        type: 'discreteBarChart',
        height: this.height,
        useInteractiveGuideline: true,
        width: this.width,
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
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d:any) {
          return d.label;
        },
        y: function(d:any) {
          return d.value;
        },
        showValues: true,
        valueFormat: function(d:any) {
          return d3.format('')(d);
        },
        discretebar: {
          dispatch: {
            //chartClick: function(e:any) {console.log('chartClick')},
            elementClick: function(e:any) {
              console.log(e);
            }
            //elementDblClick: function(e:any) {console.log('elementDblClick')},
            // elementMouseover: function(e:any) {console.log('elementMouseover')},
            // elementMouseout: function(e:any) {console.log('elementMouseout')},
          }
        },
        duration: 500,
        xAxis: {
          axisLabel: '',
          rotateLabels: 0,
          showMaxMin: true,
          axisLabelDistance: 100,
          staggerLabels: false,
          rotateYLabel: true,
          height: 60,
          ticks: null,
          width: 75,
          margin: {
            top: 300,
            right: 200,
            bottom: 500,
            left: 500
          },
          duration: 250,
          orient: 'bottom',
          tickValues: null,
          tickSubdivide: 0,
          tickSize: 6,
          tickPadding: 7,
          domain: [0, 1],
          range: [0, 1]
        },
        stacked: false,
        yAxis: {
          axisLabel: '',
          axisLabelDistance: -10
        }
      }
    };
  }
}
