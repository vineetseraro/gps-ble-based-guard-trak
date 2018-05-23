import { HttpRestService } from '../../core/http-rest.service';
import { ValidationModule } from '../../core/validators/validation.module';
import { AddmoreModule } from '../shared/addmore/addmore.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryRoutingModule } from './category.routing';
import { CategoryComponent } from './category/category.component';
import { CategoryApiService } from './shared/categoryapiservice';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RlTagInputModule } from 'angular2-tag-input';
import { WidgetModule } from '../../core/widget/widget.module';
import { GlobalService } from '../../core/global.service';


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
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    AddmoreModule,
    ValidationModule,
    ReactiveFormsModule,
    WidgetModule,
    RlTagInputModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule
  ],
  declarations: [CategoryComponent, CategoryListComponent],

  providers: [
    HttpRestService,
    CategoryApiService,
    GlobalService
  ],

})
export class CategoryModule { }
