import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';

import { PageComponent } from '../../themes/stryker/page/page.component';
import { MobileLogsTrackingComponent } from './mobilelogs-tracking/mobilelogs-tracking.component';
import { PointStatusTrackingComponent } from './pointstatus-tracking/pointstatus-tracking.component';
import { RawSensorsTrackingComponent } from './rawsensors-tracking/rawsensors-tracking.component';

export const routes: Routes = [
  {
    component: PageComponent,
    path: 'diagnostics',
    children: [
    {
      path: 'rawsensors-tracking', component: RawSensorsTrackingComponent,
      data: { title: 'Akwa - Diagnostics : Raw Data Points', resource: 'Raw Data Points', type: 'list' },
      canActivate: [AuthGuard]
    },
    {
      path: 'pointstatus-tracking', component: PointStatusTrackingComponent,
      data: { title: 'Akwa - Diagnostics : Accepted/Discarded Data Points', resource: 'Accepted/Discarded Data Points', type: 'list' },
      canActivate: [AuthGuard]
    },
    {
      path: 'mobilelogs-tracking', component: MobileLogsTrackingComponent,
      data: { title: 'Akwa - Diagnostics : Mobile Logs Tracking', resource: 'Mobile logs', type: 'list' },
      canActivate: [AuthGuard]
    },

  ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);


