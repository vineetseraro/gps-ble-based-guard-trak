import { PageComponent } from '../../themes/stryker/page/page.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order/order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';


const orderroutes: Routes = [
  {
    component: PageComponent,
    path: 'orders',
    children: [
      {
        path: '', component: OrderListComponent,
        data: { title: 'Akwa - Orders', resource: 'Orders', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: OrderComponent,
        data: { title: 'Akwa - Orders', resource: 'Orders', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: OrderComponent,
        data: { title: 'Akwa - Orders', resource: 'Orders', type: 'add' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add/:copyfrom', component: OrderComponent,
        data: { title: 'Akwa - Orders', resource: 'Orders', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(orderroutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrderRoutingModule { }

