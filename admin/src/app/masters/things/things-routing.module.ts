import { TempTagComponent } from './tempTags/tempTags/tempTags.component';
import { TempTagsListComponent } from './tempTags/tempTags-list/tempTags-list.component';
import { PageComponent } from '../../themes/stryker/page/page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/shared/auth-guard.service';
import { BeaconListComponent } from './beacons/beacon-list/beacon-list.component';
import { BeaconComponent } from './beacons/beacon/beacon.component';
import { GatewayListComponent } from './gateways/gateway-list/gateway-list.component';
import { GatewayComponent } from './gateways/gateway/gateway.component';
import { AppGatewayListComponent } from './app-gateways/app-gateway-list/app-gateway-list.component';
import { AppGatewayComponent } from './app-gateways/app-gateway/app-gateway.component';
import { NfcTagComponent } from './nfcTags/nfcTags/nfcTags.component';
import { NfcTagsListComponent } from './nfcTags/nfcTags-list/nfcTags-list.component';

const thingsroutes: Routes = [
  {
    component: PageComponent,
    path: 'things',
    children: [
      {
        path: 'beacons',
        children: [
          {
            path: '',
            component: BeaconListComponent,
            data: { title: 'Akwa - Beacons', resource: 'Beacons', type: 'list' },
            canActivate: [AuthGuard]
          },
          {
            path: 'edit/:id',
            component: BeaconComponent,
            data: { title: 'Akwa - Beacons', resource: 'Beacons', type: 'edit' },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'gateways',
        children: [
          {
            path: '',
            component: GatewayListComponent,
            data: { title: 'Akwa - Gateways', resource: 'Gateways', type: 'list' },
            canActivate: [AuthGuard]
          },
          {
            path: ':edit/:id',
            component: GatewayComponent,
            data: { title: 'Akwa - Gateways', resource: 'Gateways', type: 'edit' },
            canActivate: [AuthGuard]
          },
          {
            path: 'add',
            component: GatewayComponent,
            data: { title: 'Akwa - Gateways', resource: 'Gateways', type: 'add' },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'apps',
        children: [
          {
            path: '',
            component: AppGatewayListComponent,
            data: { title: 'Akwa - Devices', resource: 'Devices', type: 'list' },
            canActivate: [AuthGuard]
          },
          {
            path: 'edit/:id',
            component: AppGatewayComponent,
            data: { title: 'Akwa - Devices', resource: 'Devices', type: 'edit' },
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'temptags',
        children: [
          {
            path: '',
            component: TempTagsListComponent,
            data: { title: 'Akwa - TempTags', resource: 'TempTags', type: 'list' }
            // canActivate: [AuthGuard]
          },
          {
            path: 'edit/:id',
            component: TempTagComponent,
            data: { title: 'Akwa - TempTags', resource: 'TempTags', type: 'edit' }
            // canActivate: [AuthGuard]
          },
          {
            path: 'add',
            component: TempTagComponent,
            data: { title: 'Akwa - TempTags', resource: 'TempTags', type: 'add' }
            // canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'nfctags',
        children: [
          {
            path: '',
            component: NfcTagsListComponent,
            data: { title: 'Akwa - NfcTags', resource: 'NfcTags', type: 'list' }
            // canActivate: [AuthGuard]
          },
          {
            path: 'edit/:id',
            component: NfcTagComponent,
            data: { title: 'Akwa - NfcTags', resource: 'NfcTags', type: 'edit' }
            // canActivate: [AuthGuard]
          },
          {
            path: 'add',
            component: NfcTagComponent,
            data: { title: 'Akwa - NfcTags', resource: 'NfcTags', type: 'add' }
            // canActivate: [AuthGuard]
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(thingsroutes)],
  exports: [RouterModule]
})
export class ThingsRoutingModule { }
