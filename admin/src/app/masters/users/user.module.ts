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
import { MyProfileComponent } from './profile/myprofile.component';
import { UserListComponent } from './user-list/user-list.component';
import { routing } from './user.routing';
import { UserComponent } from './user/user.component';


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
  declarations: [UserListComponent, UserComponent, MyProfileComponent],
  providers: [
    UserParametersService, UserListComponent, UserComponent, UserPoolUserService, UserPoolGroupService, MyProfileComponent
  ],
  exports: [UserListComponent, UserComponent, MyProfileComponent],
})
export class UserModule { }

