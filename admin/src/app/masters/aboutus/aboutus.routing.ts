import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BlankComponent } from '../../themes/stryker/blank/blank.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FaqComponent } from './faq/faq.component';

// import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';

const routes: Routes = [
  {
    component: BlankComponent,
    path: 'aboutus',
    // data: { name: 'users' },
    // canActivate: [AuthGuard],
    children: [
      { path: '', component: AboutusComponent, data: { title: 'Akwa - About Us' } }
    ]
  },
  {
    component: BlankComponent,
    path: 'faq',
    // data: { name: 'users' },
    // canActivate: [AuthGuard],
    children: [
      { path: '', component: FaqComponent, data: { title: 'Akwa - Faqs' } }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

