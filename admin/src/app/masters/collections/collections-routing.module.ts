import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionComponent } from './collection/collection.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const collectionRoutes: Routes = [
  {
    component: PageComponent,
    path: 'collections',
    children: [
      {
        path: '', component: CollectionListComponent,
        data: { title: 'Akwa - Collections', resource: 'Collections', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: CollectionComponent,
        data: { title: 'Akwa - Collections', resource: 'Collections', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: CollectionComponent,
        data: { title: 'Akwa - Collections', resource: 'Collections', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(collectionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CollectionRoutingModule { }


