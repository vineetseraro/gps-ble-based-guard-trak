import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { UserComponent } from '../users/user/user.component';
import { UserListComponent } from './../users/user-list/user-list.component';
import { UserPoolAttributeListComponent } from './userpool-attribute-list/userpool-attribute-list.component';
import { UserPoolAttributeComponent } from './userpool-attribute/userpool-attribute.component';
import { UserPoolClientListComponent } from './userpool-client-list/userpool-client-list.component';
import { UserPoolClientComponent } from './userpool-client/userpool-client.component';
import { UserPoolGroupListComponent } from './userpool-group-list/userpool-group-list.component';
import { UserPoolGroupComponent } from './userpool-group/userpool-group.component';
import { UserPoolMessageComponent } from './userpool-message/userpool-message.component';
import { UserPoolPoliciesComponent } from './userpool-policies/userpool-policies.component';
import { UserPoolComponent } from './userpool/userpool.component';

// angular
// custom

const userpoolroutes: Routes = [
  {
    component: PageComponent,
    path: 'userpools',
    data: { title: 'Akwa - User Admin', resource: 'User - Admin', type: 'list' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserPoolComponent,
        data: { title: 'Akwa - User Admin' }
      },
      {
        path: 'attributes',
        children: [
          {
            path: '',
            component: UserPoolAttributeListComponent,
            data: { title: 'Akwa - User Admin Attributes' }
          },
          {
            path: 'add',
            component: UserPoolAttributeComponent,
            data: { title: 'Akwa - User Admin Attributes' }
          }
        ]
      },
      {
        path: 'policies',
        component: UserPoolPoliciesComponent,
        data: { title: 'Akwa - Password Policy' }
      },
      {
        path: 'messages',
        component: UserPoolMessageComponent,
        data: { title: 'Akwa - User Admin Messages' }
      },
      {
        path: 'clients',
        children: [
          {
            path: '',
            component: UserPoolClientListComponent,
            data: { title: 'Akwa - User Admin Clients' }
          },
          {
            path: 'edit/:userpoolid/:clientid',
            component: UserPoolClientComponent,
            data: { title: 'Akwa - User Admin Clients' }
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UserListComponent,
            data: { title: 'Akwa - Users' }
          },
          {
            path: 'add',
            component: UserComponent,
            data: { title: 'Akwa - Users' }
          },
          {
            path: 'edit/:sub',
            component: UserComponent,
            data: { title: 'Akwa - Users' }
          }
        ]
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            component: UserPoolGroupListComponent,
            data: { title: 'Akwa - Groups' }
          },
          {
            path: 'addgroup',
            component: UserPoolGroupComponent,
            data: { title: 'Akwa - Groups' }
          },
          {
            path: 'editgroup/:name',
            component: UserPoolGroupComponent,
            data: { title: 'Akwa - Groups' }
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(userpoolroutes)],
  exports: [RouterModule]
})
export class UserPoolRoutingModule {}
