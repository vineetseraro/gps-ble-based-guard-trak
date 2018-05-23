import { WidgetModule } from './../../core/widget/widget.module';
import { ValidationModule } from '../../core/validators/validation.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent } from './collection/collection.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionRoutingModule } from './collections-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RlTagInputModule } from 'angular2-tag-input';


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
  ToggleButtonModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RlTagInputModule,
    CollectionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    CalendarModule,
    FieldsetModule,
    PanelModule,
    WidgetModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule
  ],
  declarations: [
    CollectionComponent,
    CollectionListComponent  ]
})
export class CollectionsModule { }
