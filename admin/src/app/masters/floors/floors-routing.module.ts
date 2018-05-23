import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { FloorListComponent } from './floor-list/floor-list.component';
import { FloorComponent } from './floor/floor.component';

export const floorRoutes: Routes = [
  {
    component: PageComponent,
    path: 'floors',
    children: [
      {
        path: '', component: FloorListComponent,
        data: { title: 'Akwa - Floors', resource: 'Locations', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: FloorComponent,
        data: { title: 'Akwa - Floors', resource: 'Locations', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: FloorComponent,
        data: { title: 'Akwa - Floors', resource: 'Locations', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(floorRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FloorRoutingModule { }


