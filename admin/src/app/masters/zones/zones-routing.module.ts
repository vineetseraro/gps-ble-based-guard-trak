import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneComponent } from './zone/zone.component';


export const zoneRoutes: Routes = [
  {
    component: PageComponent,
    path: 'zones',
    children: [
      {
        path: '', component: ZoneListComponent,
        data: { title: 'Akwa - Zones', resource: 'Locations', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: ZoneComponent,
        data: { title: 'Akwa - Zones', resource: 'Locations', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: ZoneComponent,
        data: { title: 'Akwa - Zones', resource: 'Locations', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(zoneRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ZoneRoutingModule { }
