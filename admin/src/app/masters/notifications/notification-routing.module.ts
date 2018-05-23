import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from '../../themes/stryker/page/page.component';
import { NotificationListComponent } from './notification-list/notification-list.component';

// import { NotificationComponent } from './notification/notification.component';


const shipmentroutes: Routes = [
  {
    component: PageComponent,
    path: 'notifications',
    children: [
      {
        path: '', component: NotificationListComponent,
        data: { title: 'Akwa - Notifications', resource: 'Notifications', type: 'list' },
        // canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(shipmentroutes)
  ],
  exports: [
    RouterModule
  ]
})
export class NotificationRoutingModule { }

