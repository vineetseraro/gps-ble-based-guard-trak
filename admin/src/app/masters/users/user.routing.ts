import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from '../../themes/stryker/page/page.component';
import { MyProfileComponent } from './profile/myprofile.component';

// import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';

const routes: Routes = [
  {
    component: PageComponent,
    path: 'profile',
    // data: { name: 'users' },
    // canActivate: [AuthGuard],
    children: [
      // { path: '', component: UserListComponent, data: { title: 'Akwa - Users' } },
      // { path: 'edit/:username', component: UserComponent, data: { title: 'Akwa - Users' } },
      // { path: 'add', component: UserComponent, data: { title: 'Akwa - Users' } },
      { path: '', component: MyProfileComponent, data: { title: 'Akwa - My Profile' } }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

