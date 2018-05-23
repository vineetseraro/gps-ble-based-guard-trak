import { ValidationModule } from '../../../core/validators/validation.module';
import { WidgetModule } from '../../../core/widget/widget.module';
import { LayoutModule } from '../../../themes/stryker/stryker-theme.module';
import { AuthGuard } from '../../authorization/shared/auth-guard.service';
import { CognitoUtil, UserLoginService, UserRegistrationService } from '../../aws/cognito.service';
import { DynamoDBService } from '../../aws/ddb.service';
import { ConfigurationService } from '../../configuration/shared/configuration.service';
import { ConfirmRegistrationComponent } from '../confirm-registration/confirm-registration.component';
import {
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component
} from '../forgot-password/forgot-password.component';
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';
import { LogoutComponent } from '../logout/logout.component';
import { RegisterComponent } from '../registration/registration.component';
import { ResendCodeComponent } from '../resend-code/resend-code.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    DropdownModule,
    FileUploadModule,
    GrowlModule,
    MultiSelectModule,
    PanelModule,
    TabViewModule,
    ToggleButtonModule
} from 'primeng/primeng';



@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    GrowlModule,
    ReactiveFormsModule,
    ValidationModule,
    LoginRoutingModule,
    DropdownModule,
    MultiSelectModule,
    TabViewModule,
    ToggleButtonModule,
    PanelModule,
    FileUploadModule,
    WidgetModule
  ],
  providers: [
    DynamoDBService,
    CognitoUtil,
    UserLoginService,
    UserRegistrationService,
    AuthGuard,
    ConfigurationService,
  ],
  declarations: [
    ForgotPasswordStep2Component,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ConfirmRegistrationComponent,
    ResendCodeComponent,
    ForgotPasswordStep1Component,
    GeneratePasswordComponent
  ]
})
export class LoginModule { }
