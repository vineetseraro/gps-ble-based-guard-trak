import { PageComponent } from '../../themes/stryker/page/page.component';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';



const shipmentroutes: Routes = [
  {
    component: PageComponent,
    path: 'shipments',
    children: [
      {
        path: '', component: ShipmentListComponent,
        data: { title: 'Akwa - Shipments', resource: 'Shipments', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: ShipmentComponent,
        data: { title: 'Akwa - Shipments', resource: 'Shipments', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: ShipmentComponent,
        data: { title: 'Akwa - Shipments', resource: 'Shipments', type: 'add' },
        canActivate: [AuthGuard],
      },
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
export class ShipmentRoutingModule { }

