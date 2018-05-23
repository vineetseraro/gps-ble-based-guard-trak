import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Configuration } from './core/ak.constants';
import { AudittrailModule } from './core/audittrail/audittrail.module';
import { LoginModule } from './core/authentication/login/login.module';
import { AuthorizationModule } from './core/authorization/authorization.module';
import { ConfigurationModule } from './core/configuration/configuration.module';
import { D3chartModule } from './core/d3chart/d3chart.module';
import { GlobalService } from './core/global.service';
import { HttpRestService } from './core/http-rest.service';
import { WidgetModule } from './core/widget/widget.module';
import { GadgetsModule } from './gadgets/gadgets.module';
import { AttributesModule } from './masters/attributes/attributes.module';
import { CategoryModule } from './masters/categories/category.module';
import { CollectionsModule } from './masters/collections/collections.module';
import { DashboardModule } from './masters/dashboard/dashboard.module';
import { FloorsModule } from './masters/floors/floors.module';
import { LocationsModule } from './masters/locations/locations.module';
import { MapModule } from './masters/map/map.module';
import { NotificationModule } from './masters/notifications/notification.module';
import { OrderModule } from './masters/orders/order.module';
import { ProductModule } from './masters/products/product.module';
import { ShipmentModule } from './masters/shipments/shipment.module';
import { TagModule } from './masters/tags/tag.module';
import { ThingsModule } from './masters/things/things.module';
import { UserPoolModule } from './masters/userpools/userpool.module';
import { UserModule } from './masters/users/user.module';
import { ZonesModule } from './masters/zones/zones.module';
import { DiagnosticsModule } from './reports/diagnostics/diagnostics.module';
import { ReportsModule } from './reports/reports.module';
import { AboutusModule } from './masters/aboutus/aboutus.module';
import { AccessDeniedComponent } from './themes/stryker/access-denied.component';
import { PageNotFoundComponent } from './themes/stryker/page-not-found.component';
import { LayoutModule } from './themes/stryker/stryker-theme.module';
import { TaskModule } from './masters/tasks/task.module';


///// Sentry.io Integration //////
/*
Raven
  .config('https://1095c0d960c141b09d164cc676ff6ef2@sentry.io/161042')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err.originalError);
  }
}
*/
@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    PageNotFoundComponent
  ],

  imports: [
    WidgetModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ProductModule,
    ShipmentModule,
    OrderModule,
    LocationsModule,
    FloorsModule,
    ZonesModule,
    LayoutModule,
    RouterModule,
    AttributesModule,
    LoginModule,
    BrowserAnimationsModule,
    TagModule,
    CategoryModule,
    CollectionsModule,
    DashboardModule,
    MapModule,
    ReportsModule,
    UserModule,
    ThingsModule,
    UserPoolModule,
    ConfigurationModule,
    AuthorizationModule,
    AudittrailModule,
    D3chartModule,
    ReportsModule,
    AboutusModule,
    DiagnosticsModule,
    NotificationModule,
    GadgetsModule,
    TaskModule,
    // Nitesh: AppRoutingModule has to be the last module. PLease add module above.
    AppRoutingModule
  ],

  providers: [
    HttpRestService,
    GlobalService,
    Configuration,
    // Nitesh : for removing # i used Path rather then # .
    // 2. I did not find the use of LocationStrategy so removed it.
    // {provide: LocationStrategy, useClass: PathLocationStrategy}
    //  { provide: ErrorHandler, useClass: RavenErrorHandler }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
