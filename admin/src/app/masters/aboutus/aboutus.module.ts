import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
} from 'primeng/primeng';

import { UserParametersService } from '../../core/aws/cognito.service';
import { ValidationModule } from '../../core/validators/validation.module';
import { WidgetModule } from '../../core/widget/widget.module';
import { UserPoolGroupService, UserPoolUserService } from '../userpools/shared/userpool.service';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FaqComponent } from './faq/faq.component';
import { routing } from './aboutus.routing';


@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    WidgetModule,
    ReactiveFormsModule,
    ValidationModule,
    CalendarModule, FieldsetModule, PanelModule,
    FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
    GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
    DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, DialogModule
  ],
  declarations: [ AboutusComponent, FaqComponent],
  providers: [
    UserParametersService,UserPoolUserService, UserPoolGroupService, AboutusComponent, FaqComponent
  ],
  exports: [ AboutusComponent, FaqComponent],
})
export class AboutusModule { }

