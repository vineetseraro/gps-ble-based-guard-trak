import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';

const routes: Routes = [
  {
    component: PageComponent,
    path: 'dashboard',
    children: [
      {
        path: '', component: DashboardComponent,
        data: { title: 'Akwa - Dashboard', resource: 'Dashboard', type: 'list' },
        canActivate: [AuthGuard],
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });


