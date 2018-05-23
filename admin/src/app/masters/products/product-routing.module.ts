import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    component: PageComponent,
    path: 'products',
    children: [
      {
        path: '', component: ProductListComponent,
        data: { title: 'Akwa - Products', resource: 'Products', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: ':id/edit', component: ProductComponent,
        data: { title: 'Akwa - Products', resource: 'Products', type: 'edit' },
        canActivate: [AuthGuard]
      },
      {
        path: 'add', component: ProductComponent,
        data: { title: 'Akwa - Products', resource: 'Products', type: 'add' },
        canActivate: [AuthGuard]
      },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });


