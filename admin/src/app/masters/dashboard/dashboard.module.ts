import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routing } from './dashboard.routing';
import { WidgetModule } from './../../core/widget/widget.module';
import { D3chartModule } from './../../core/d3chart/d3chart.module';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { TableComponent } from './gadgets/table/table.component';
import { MapComponent } from './gadgets/map/map.component';
import { MapModule } from './../../masters/map/map.module';
import { ReportsModule } from './../../reports/reports.module';
import { GraphComponent } from './gadgets/graph/graph.component';
import { ControlFactoryDirective } from './shared/control-factory.directive'

import {
  AutoCompleteModule,
  ButtonModule,
  CheckboxModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  FileUploadModule,
  GMapModule,
  GrowlModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextareaModule,
  MultiSelectModule,
  PasswordModule,
  RadioButtonModule,
  SharedModule,
  SliderModule,
  SpinnerModule,
  SplitButtonModule,
  TabViewModule,
  ToggleButtonModule
} from 'primeng/primeng';

@NgModule({
  imports: [
  //  DynamicModule.forRoot(),
    CommonModule,
    routing,
    GMapModule,
    WidgetModule,
    DragulaModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule,
    D3chartModule,
    MapModule,
    ReportsModule

  ],
  declarations: [DashboardComponent, ControlFactoryDirective, TableComponent, MapComponent, GraphComponent],
  entryComponents: [TableComponent, MapComponent, GraphComponent],
  exports: [TableComponent, MapComponent, GraphComponent]
})
export class DashboardModule { }
