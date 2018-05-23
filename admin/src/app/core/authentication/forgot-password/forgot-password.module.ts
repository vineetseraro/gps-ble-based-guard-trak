import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationModule } from '../../../core/validators/validation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidationModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class ForgotPasswordModule { }
