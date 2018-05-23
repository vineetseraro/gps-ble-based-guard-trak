import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { GMapModule } from 'primeng/primeng';

import { WidgetModule } from '../../core/widget/widget.module';
import { ReportsModule } from './../../reports/reports.module';
import { ShipmentmapComponent } from './components/leaflet/shipmentmap.component';
import { ShipmentrouteComponent } from './components/leaflet/Shipmentroute.component';
import { ShipmentroutemapComponent } from './components/leaflet/Shipmentroutemap.component';
import { UserrouteComponent } from './components/leaflet/userroute.component';
import { UsersComponent } from './components/leaflet/users.component';
import { ToursComponent } from './components/leaflet/tours.component';
import { routing } from './map.routing';

//import { SigV4Utils } from '../shared/sigv4utils.service';


@NgModule({
  imports: [
    CommonModule,
    routing,
    GMapModule,
    BrowserModule,
    WidgetModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQvXMZY_1l5uHWAGn1a60hoj9Pech1Qf4',
      libraries: ['places']
    }),
    LeafletModule,
    ReportsModule
  ],
  declarations: [
    ShipmentmapComponent,
    ShipmentroutemapComponent,
    ShipmentrouteComponent,
    UsersComponent,
    UserrouteComponent,
    ToursComponent
  ],
  exports: [
    ShipmentmapComponent,
    ShipmentroutemapComponent,
    UsersComponent,
    UserrouteComponent
  ],
  providers: [
    //SigV4Utils
  ],

})
export class MapModule { }
