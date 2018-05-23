import { ValidationModule } from '../../core/validators/validation.module';
import { AddmoreModule } from '../shared/addmore/addmore.module';
import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order/order.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/primeng';
import { RlTagInputModule } from 'angular2-tag-input';
import { WidgetModule } from './../../core/widget/widget.module';
import { OrderStatusPipe } from '../../core/pipes/order-status.pipe';


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
    OrderRoutingModule, AddmoreModule,
    FormsModule,
    WidgetModule,
    ReactiveFormsModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule,
    ConfirmDialogModule
  ],
  declarations: [
     OrderComponent,
     OrderListComponent,
     OrderStatusPipe
  ],
})

export class OrderModule { }
