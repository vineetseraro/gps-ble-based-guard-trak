import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RlTagInputModule } from 'angular2-tag-input';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataTableModule,
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

import { PrettyPrintPipeModule } from '../pipes/pretty-print.pipe';
import { ValidationModule } from '../../core/validators/validation.module';
import { WidgetModule } from '../../core/widget/widget.module';
import { AudittrailListComponent } from './audittrail-list/audittrail-list.component';
import { AuditRoutingModule } from './audittrail-routing.module';
import { AudittrailComponent } from './audittrail/audittrail.component';





@NgModule({
  imports: [
    ValidationModule,
    RlTagInputModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AuditRoutingModule,
    FormsModule,
    WidgetModule,
    ReactiveFormsModule,
    DropdownModule,
    PrettyPrintPipeModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule
  ],
  declarations: [AudittrailComponent, AudittrailListComponent]
})
export class AudittrailModule { }
