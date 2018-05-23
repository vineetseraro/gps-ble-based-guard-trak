import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationComponent } from './location/location.component';
import { NgModule } from '@angular/core';


export const locationRoutes: Routes = [
  {
    component: PageComponent,
    path: 'locations',
    children: [
      {
        path: '', component: LocationListComponent,
        data: { title: 'Akwa - Locations', resource: 'Locations', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: LocationComponent,
        data: { title: 'Akwa - Locations', resource: 'Locations', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: LocationComponent,
        data: { title: 'Akwa - Locations', resource: 'Locations', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(locationRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LocationRoutingModule { }


