import { PageComponent } from '../../themes/stryker/page/page.component';
import { AttributeListComponent } from './attribute-list/attribute-list.component';
import { AttributeComponent } from './attribute/attribute.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { NgModule } from '@angular/core';

export const attributeRoute: Routes = [
  {
    component: PageComponent,
    path: 'attributes',
    children: [
      {
        path: '', component: AttributeListComponent,
        data: { title: 'Akwa - Attributes', resource: 'Attribute', type: 'list' },
        canActivate: [AuthGuard]
      },
      { path: ':id/edit', component: AttributeComponent,
        data: { title: 'Akwa - Attributes', resource: 'Attribute', type: 'edit' },
        canActivate: [AuthGuard],
      },
      { path: 'add', component: AttributeComponent,
        data: { title: 'Akwa - Attributes', resource: 'Attribute', type: 'add' },
        canActivate: [AuthGuard],
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(attributeRoute)
  ],
  exports: [
    RouterModule
  ]
})
export class AttributeRoutingModule { }


