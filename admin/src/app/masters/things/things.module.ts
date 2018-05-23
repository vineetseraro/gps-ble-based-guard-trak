import { TempTagComponent } from './tempTags/tempTags/tempTags.component';
import { TempTagsListComponent } from './tempTags/tempTags-list/tempTags-list.component';
import { ThingsService } from './shared/things.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThingsRoutingModule } from './things-routing.module';
import { BeaconListComponent } from './beacons/beacon-list/beacon-list.component';
import { BeaconComponent } from './beacons/beacon/beacon.component';
import { GatewayListComponent } from './gateways/gateway-list/gateway-list.component';
import { AppGatewayListComponent } from './app-gateways/app-gateway-list/app-gateway-list.component';
import { AppGatewayComponent } from './app-gateways/app-gateway/app-gateway.component';
import { GatewayComponent } from './gateways/gateway/gateway.component';
import { ValidationModule } from '../../core/validators/validation.module';
import { NfcTagComponent } from './nfcTags/nfcTags/nfcTags.component';
import { NfcTagsListComponent } from './nfcTags/nfcTags-list/nfcTags-list.component';


import {
  GrowlModule,
  DataTableModule,
  TabViewModule,
  DropdownModule,
  PanelModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  ToggleButtonModule
} from 'primeng/primeng';
import { WidgetModule } from '../../core/widget/widget.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GrowlModule,
    CommonModule,
    WidgetModule,
    DialogModule,
    DataTableModule,
    DropdownModule,
    PanelModule,
    TabViewModule,
    ValidationModule,
    ThingsRoutingModule,
    ButtonModule,
    CheckboxModule,
    ToggleButtonModule
  ],
  declarations: [
    BeaconListComponent,
    BeaconComponent,
    GatewayListComponent,
    GatewayComponent,
    AppGatewayListComponent,
    AppGatewayComponent,
    TempTagComponent,
    TempTagsListComponent,
    NfcTagComponent,
    NfcTagsListComponent
  ],
  providers: [ThingsService]
})
export class ThingsModule {}
