import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlankComponent } from '../../themes/stryker/blank/blank.component';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { ShipmentmapComponent } from './components/leaflet/shipmentmap.component';
import { ShipmentrouteComponent } from './components/leaflet/Shipmentroute.component';
import { UserrouteComponent } from './components/leaflet/userroute.component';
import { UsersComponent } from './components/leaflet/users.component';
import { ToursComponent } from './components/leaflet/tours.component';

const routes: Routes = [
  {
    component: PageComponent,
    path: 'adminmap',
    data: { name: 'map' },
    // canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'userroute/:employeeId', component: UserrouteComponent },

    ]
  },
  {
    component: BlankComponent,
    path: 'map',
    data: { name: 'map' },
    // canActivate: [AuthGuard],
    children: [
      { path: 'shipments', component: ShipmentmapComponent },
      { path: 'shipmentroute/:shipmentid', component: ShipmentrouteComponent },
      { path: 'users', component: UsersComponent },
      { path: 'userroute/:employeeId', component: UserrouteComponent },
      { path: 'tour', component: ToursComponent },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });


