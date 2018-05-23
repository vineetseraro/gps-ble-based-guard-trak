import { ValidationModule } from '../../core/validators/validation.module';
import { AddmoreModule } from '../shared/addmore/addmore.module';
import { ShipmentRoutingModule } from './shipment-routing.module';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/primeng';
import { RlTagInputModule } from 'angular2-tag-input';
import { WidgetModule } from './../../core/widget/widget.module';
import { ShipmentStatusPipe } from '../../core/pipes/shipment-status.pipe';
import { MapModule } from './../../masters/map/map.module';

import {
  AutoCompleteModule,
  ButtonModule,
  CalendarModule,
  CheckboxModule,
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
  ConfirmDialogModule
} from 'primeng/primeng';




@NgModule({
  imports: [
    ValidationModule,
    EditorModule,
    CommonModule,
    RlTagInputModule,
    ShipmentRoutingModule, AddmoreModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule, MapModule,
    ConfirmDialogModule
  ],
  declarations: [
     ShipmentComponent,
     ShipmentListComponent,
     ShipmentStatusPipe
  ],
})

export class ShipmentModule { }
