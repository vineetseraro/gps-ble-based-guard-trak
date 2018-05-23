import { BlankComponent } from '../../../themes/stryker/blank/blank.component';
import { ConfirmRegistrationComponent } from '../confirm-registration/confirm-registration.component';
import {
  ForgotPasswordStep2Component,
  ForgotPasswordStep1Component
} from '../forgot-password/forgot-password.component';
import { LogoutComponent } from '../logout/logout.component';
import { RegisterComponent } from '../registration/registration.component';
import { ResendCodeComponent } from '../resend-code/resend-code.component';
import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';

export const loginRoutes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Akwa - Login' }},
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'forgot-password-step1', component: ForgotPasswordStep1Component, data: { title: 'Akwa - Forgot Password' } },
      { path: 'forgot-password-step1/:email', component: ForgotPasswordStep1Component, data: { title: 'Akwa - Forgot Password' } },
      { path: 'forgot-password-step2/:email', component: ForgotPasswordStep2Component, data: { title: 'Akwa - Forgot Password' } },
      { path: 'register', component: RegisterComponent, data: { title: 'Akwa - Register' } },
      { path: 'logout', component: LogoutComponent },
      { path: 'confirm-registration/:username', component: ConfirmRegistrationComponent, data: { title: 'Akwa - Confirm Registration' } },
      { path: 'resend-code', component: ResendCodeComponent, data: { title: 'Akwa - Resend Code' } },
      { path: 'generate-password/:username', component: GeneratePasswordComponent, data: { title: 'Akwa - Generate Password' } },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule { }
