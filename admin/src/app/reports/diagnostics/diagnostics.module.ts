import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataListModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
} from 'primeng/primeng';

import { PrettyPrintPipeModule } from '../../core/pipes/pretty-print.pipe';
import { WidgetModule } from '../../core/widget/widget.module';
import { routing } from './diagnostics-routing.module';
import { MobileLogsTrackingComponent } from './mobilelogs-tracking/mobilelogs-tracking.component';
import { PointStatusTrackingComponent } from './pointstatus-tracking/pointstatus-tracking.component';
import { RawSensorsTrackingComponent } from './rawsensors-tracking/rawsensors-tracking.component';

@NgModule({
  imports: [
    routing,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataTableModule,
    DataListModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
    PrettyPrintPipeModule,
    WidgetModule,
    CommonModule
  ],
  declarations: [
    RawSensorsTrackingComponent,
    PointStatusTrackingComponent,
    MobileLogsTrackingComponent
  ]
})


export class DiagnosticsModule { }
