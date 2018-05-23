import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule, DataTableModule, DropdownModule, GrowlModule, ToggleButtonModule } from 'primeng/primeng';

import { ValidationModule } from '../../core/validators/validation.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidationModule,
    BrowserModule,
    DataTableModule, DropdownModule, ToggleButtonModule, CheckboxModule,
    GrowlModule,
    ConfigurationRoutingModule
  ],
  declarations: [ConfigurationComponent],
  providers: [

  ],
})
export class ConfigurationModule { 
 
}

