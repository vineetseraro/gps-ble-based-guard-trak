import { WidgetModule } from './../../core/widget/widget.module';
import { AkRoleDirective } from '../../core/authorization/shared/auth-role.directive';
import { ValidationModule } from '../../core/validators/validation.module';
import { AddmoreModule } from '../shared/addmore/addmore.module';
import { ProductListComponent } from './product-list/product-list.component';
import { routing } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RlTagInputModule } from 'angular2-tag-input';
import { EditorModule } from 'primeng/primeng';
import { D3chartModule } from '../../core/d3chart/d3chart.module';

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
    ValidationModule,
    EditorModule,
    CommonModule,
    RlTagInputModule,
    routing,
    AddmoreModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    FieldsetModule,
    PanelModule,
    FileUploadModule,
    SplitButtonModule,
    AutoCompleteModule,
    PasswordModule,
    RadioButtonModule,
    TabViewModule,
    GMapModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    SliderModule,
    SpinnerModule,
    ToggleButtonModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
    DialogModule,
    D3chartModule
  ],
  declarations: [ProductComponent, ProductListComponent, AkRoleDirective]
})
export class ProductModule {}
