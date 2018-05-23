import 'd3';
import { NvD3Module } from 'ngx-nvd3';

import 'nvd3';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { GlobalService } from './../global.service';
import { D3barchartComponent } from './d3barchart/d3barchart.component';
import { D3donutchartComponent } from './d3donutchart/d3donutchart.component';
import { D3linechartComponent } from './d3linechart/d3linechart.component';
import { D3piechartComponent } from './d3piechart/d3piechart.component';

@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, NvD3Module],
  declarations: [
    D3piechartComponent,
    D3linechartComponent,
    D3barchartComponent,
    D3donutchartComponent
  ],
  exports: [D3piechartComponent, D3linechartComponent, D3barchartComponent, D3donutchartComponent],
  entryComponents: [
    D3piechartComponent,
    D3linechartComponent,
    D3barchartComponent,
    D3donutchartComponent
  ],
  providers: [GlobalService]
})
export class D3chartModule {}
