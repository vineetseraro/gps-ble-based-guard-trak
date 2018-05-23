import { TagListComponent } from './tag-list/tag-list.component';
import { TagComponent } from './tag/tag.component';
import { ValidationModule } from '../../core/validators/validation.module';
import { TagRoutingModule } from './tag-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RlTagInputModule } from 'angular2-tag-input';
import { WidgetModule } from './../../core/widget/widget.module';


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
  DialogModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    ValidationModule,
    RlTagInputModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    TagRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    WidgetModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule
  ],
  declarations: [TagComponent, TagListComponent]
})
export class TagModule { }
