import { ValidationModule } from '../../core/validators/validation.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, GrowlModule , DataTableModule, DropdownModule, ToggleButtonModule } from 'primeng/primeng';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { PermissionComponent } from './permissions/permission.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    DataTableModule, DropdownModule, ToggleButtonModule, CheckboxModule,
    GrowlModule,
    AuthorizationRoutingModule
  ],
  declarations: [PermissionComponent],
  providers: [

  ],
})
export class AuthorizationModule { }

