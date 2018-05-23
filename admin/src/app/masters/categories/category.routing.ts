import { PageComponent } from '../../themes/stryker/page/page.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryComponent } from './category/category.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { NgModule } from '@angular/core';


export const categoryRoutes: Routes = [
  {
    component: PageComponent,
    path: 'categories',
    children: [
      {
        path: '', component: CategoryListComponent,
        data: { title: 'Akwa - Categories', resource: 'Category', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: CategoryComponent,
        data: { title: 'Akwa - Categories', resource: 'Category', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: CategoryComponent,
        data: { title: 'Akwa - Categories', resource: 'Category', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(categoryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CategoryRoutingModule { }


