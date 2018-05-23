import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagComponent } from './tag/tag.component';


const tagroutes: Routes = [
 {
    component: PageComponent,
    path: 'tags',
    children: [
      {
        path: '', component: TagListComponent,
        data: { title: 'Akwa - Tags', resource: 'Tags', type: 'list' },
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit', component: TagComponent,
        data: { title: 'Akwa - Tags', resource: 'Tags', type: 'edit' },
        canActivate: [AuthGuard],
      },
      {
        path: 'add', component: TagComponent,
        data: { title: 'Akwa - Tags', resource: 'Tags', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(tagroutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TagRoutingModule { }


