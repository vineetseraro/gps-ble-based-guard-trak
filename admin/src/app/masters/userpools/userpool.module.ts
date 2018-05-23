import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/primeng';
import { CheckboxModule, DataTableModule, DropdownModule, ToggleButtonModule } from 'primeng/primeng';
import { GrowlModule, TabViewModule } from 'primeng/primeng';

import { AwsUtil } from '../../core/aws/aws.service';
import { UserParametersService } from '../../core/aws/cognito.service';
import { ValidationModule } from '../../core/validators/validation.module';
import { UserModule } from '../users/user.module';
import {
    UserPoolApiService,
    UserPoolClientService,
    UserPoolGroupService,
    UserPoolNoAuthService,
    UserPoolService,
} from './shared/userpool.service';
import { UserPoolAttributeListComponent } from './userpool-attribute-list/userpool-attribute-list.component';
import { UserPoolAttributeComponent } from './userpool-attribute/userpool-attribute.component';
import { UserPoolClientListComponent } from './userpool-client-list/userpool-client-list.component';
import { UserPoolClientComponent } from './userpool-client/userpool-client.component';
import { UserPoolGroupListComponent } from './userpool-group-list/userpool-group-list.component';
import { UserPoolGroupComponent } from './userpool-group/userpool-group.component';
import { UserPoolMessageComponent } from './userpool-message/userpool-message.component';
import { UserPoolPoliciesComponent } from './userpool-policies/userpool-policies.component';
import { UserPoolRoutingModule } from './userpool-routing.module';
import { UserPoolUserGroupTabsComponent } from './userpool-user-group/userpool-user-group-tabs.component';
import { UserPoolComponent } from './userpool/userpool.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    DataTableModule, DropdownModule, ToggleButtonModule, CheckboxModule,
    UserPoolRoutingModule,
    GrowlModule, TabViewModule, UserModule, EditorModule
  ],
  declarations: [UserPoolComponent, UserPoolAttributeComponent, UserPoolAttributeListComponent,
   UserPoolPoliciesComponent, UserPoolUserGroupTabsComponent, UserPoolMessageComponent, UserPoolGroupComponent,
   UserPoolClientListComponent, UserPoolClientComponent, UserPoolGroupListComponent],
  providers: [
    UserParametersService,
    UserPoolService,
    UserPoolGroupService,
    UserPoolClientService,
    UserPoolApiService,
    UserPoolNoAuthService,
    AwsUtil
  ],
})
export class UserPoolModule { }

