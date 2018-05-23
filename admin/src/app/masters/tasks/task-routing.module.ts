import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskComponent } from './tasks/task.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    component: PageComponent,
    path: 'tasks',
    children: [
      {
        path: '', component: TaskListComponent,
        data: { title: 'Akwa - Tour Schedule', resource: 'Tour Schedule', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: ':id/edit', component: TaskComponent,
        data: { title: 'Akwa - Edit Tour Schedule', resource: 'Tour Schedule', type: 'edit' },
        canActivate: [AuthGuard]
      },
      {
        path: 'add', component: TaskComponent,
        data: { title: 'Akwa - Add Tour Schedule', resource: 'Tour Schedule', type: 'add' },
        canActivate: [AuthGuard]
      },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });


