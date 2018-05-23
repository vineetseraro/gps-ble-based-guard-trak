import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { ConfigurationComponent } from './configuration.component';

// angular
// custom



const configurationroutes: Routes = [
  {
    component: PageComponent,
    path: 'configuration',
    children: [
      { path: '', component: ConfigurationComponent ,
      data: { title: 'Akwa - Configuration', resource: 'Configuration', type: 'list' },
      canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(configurationroutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ConfigurationRoutingModule { }

