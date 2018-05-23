import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

declare let d3: any;
@Component({
  selector: 'app-d3linechart',
  templateUrl: './d3linechart.component.html',
  styleUrls: ['./d3linechart.component.css']
})
export class D3linechartComponent implements OnInit {
  @Input('height') height: any;
  @Input('width') width: any;
  @Input('data') data: any;
  @Input('api') api: any;
  @Input('extraOptions') extraOptions: any;
  options;
  chartType;

  constructor() {}

  ngOnInit() {
    if (this.height == null) {
      this.height = 320;
    }
    console.log(this.extraOptions);
    this.options = {
      chart: {
        type: 'lineChart',
        // pie: {
        //   dispatch: {
        //     //chartClick: function(e:any) {console.log('chartClick')},
        //     elementClick: function(e:any) {
        //       this.showReport(e);
        //     }
        //     //elementDblClick: function(e:any) {console.log('elementDblClick')},
        //     // elementMouseover: function(e:any) {console.log('elementMouseover')},
        //     // elementMouseout: function(e:any) {console.log('elementMouseout')},
        //   }
        // },
        height: this.height,
        // donut: true,
        showControls: true,
        showValues: true,
        x: function(d: any) {
          return d.x;
        },
        y: function(d: any) {
          return d.y;
        },
        showLabels: false,
        xScale: d3.time.scale(),
        xAxis: {
          axisLabel: this.extraOptions.xLabel,
          rotateLabels: 60,
          showMaxMin: true,
          tickFormat: d => {
            return moment(d)
              .tz(window.localStorage.getItem('userTimeZone'))
              .format(window.localStorage.getItem('dateTimeFormat'));
          }
        },
        yAxis: {
          axisLabel: this.extraOptions.yLabel
        },
        // tooltipYContent: 'abc',
        // valueFormat: function(d:any) {
        //   return d3.format('')(d);
        // },
        // duration: 500,
        labelThreshold: 0.01,
        useInteractiveGuideline: true,
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
}
