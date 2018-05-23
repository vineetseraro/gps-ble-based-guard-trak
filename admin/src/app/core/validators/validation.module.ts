import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GrowlModule, TabViewModule } from 'primeng/primeng';

import { AkGrowlComponent } from './ak-growl.component';
import { AkServerValidationComponent } from './ak-server-validation.component';
import { AkTabViewComponent } from './ak-tabview.component';
import { ControlMessagesComponent } from './control-messages.component';
import { ValidationService } from './validation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GrowlModule,
    TabViewModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  declarations: [ControlMessagesComponent, AkGrowlComponent, AkServerValidationComponent, AkTabViewComponent],
  exports: [ControlMessagesComponent, AkGrowlComponent, AkServerValidationComponent, AkTabViewComponent],
  providers: [ValidationService],
})
export class ValidationModule { }
