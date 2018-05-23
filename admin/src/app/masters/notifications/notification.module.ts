import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RlTagInputModule } from 'angular2-tag-input';
import { NotificationService } from 'app/masters/notifications/shared/notification.service';
import { EditorModule } from 'primeng/primeng';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
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

import { ValidationModule } from '../../core/validators/validation.module';
import { AddmoreModule } from '../shared/addmore/addmore.module';
import { WidgetModule } from './../../core/widget/widget.module';
import { MapModule } from './../../masters/map/map.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationRoutingModule } from './notification-routing.module';

// import { NotificationComponent } from './notification/notification.component';
// import { NotificationStatusPipe } from '../../core/pipes/shipment-status.pipe';



@NgModule({
  imports: [
    ValidationModule,
    EditorModule,
    CommonModule,
    RlTagInputModule,
    NotificationRoutingModule, AddmoreModule,
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
     // NotificationComponent,
     NotificationListComponent,
     // NotificationStatusPipe
  ],
  providers: [NotificationService]
})

export class NotificationModule { }
