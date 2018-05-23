import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { AudittrailListComponent } from './audittrail-list/audittrail-list.component';
import { AudittrailComponent } from './audittrail/audittrail.component';


export const auditRoutes: Routes = [
  {
    component: PageComponent,
    path: 'audittrails',

    children: [
      {
        path: '', component: AudittrailListComponent,
        data: { title: 'Akwa - Audit Trail', resource: 'Audit Trail', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/view', component: AudittrailComponent,
        data: { title: 'Akwa - Audit Trail Detail', resource: 'Audit Trail', type: 'edit' },
        canActivate: [AuthGuard],
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(auditRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuditRoutingModule { }

