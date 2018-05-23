import { PageComponent } from '../../themes/stryker/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permissions/permission.component';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';

// angular
// custom



const authorizationroutes: Routes = [
  {
    component: PageComponent,
    path: 'permissions',
    children: [
      {
        path: '', component: PermissionComponent,
        data: { title: 'Akwa - Permissions', resource: 'Permissions', type: 'list' },
        canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(authorizationroutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthorizationRoutingModule { }

