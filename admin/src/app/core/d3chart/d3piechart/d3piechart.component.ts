import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-d3piechart',
  templateUrl: './d3piechart.component.html',
  styleUrls: ['./d3piechart.component.css']
})
export class D3piechartComponent implements OnInit {

  @Input('data') data: any;
  options;
//  data;
  chartType;
  el: any;


 ngOnInit(){
    
    
    this.options =  {
        chart: {
            type: 'pieChart',
            height: 320,
            pie: {
                dispatch: {
                //chartClick: function(e:any) {console.log('chartClick')},
                elementClick: function(e:any) {console.log(e)},
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
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showLabels: true,
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
        document.getElementsByTagName("nvd3")[0].setAttribute('id','piechart');
    document.getElementsByTagName("nvd3")[0].setAttribute('allowfullscreen','true');

  }
}