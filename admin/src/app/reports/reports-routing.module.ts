import { TourDetailComponent } from './report-tour-report/tourdetail.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageComponent } from '../themes/stryker/page/page.component';
import { DeviceLocatorHistoryComponent } from './device-locator-history/device-locator-history.component';
import { DeviceLocatorComponent } from './device-locator/device-locator.component';
import { ProductLocatorHistoryComponent } from './product-locator-history/product-locator-history.component';
import { ProductLocatorComponent } from './product-locator/product-locator.component';
import { ReporShipmentDeliveryTimeComponent } from './repor-shipment-delivery-time/repor-shipment-delivery-time.component';
import {
    ReporShipmentsCountByLocationComponent,
} from './repor-shipments-count-by-location/repor-shipments-count-by-location.component';
import {
    ReporSkuSensorMappingHistoryComponent,
} from './repor-sku-sensor-mapping-history/repor-sku-sensor-mapping-history.component';
import { ReportAppStatusComponent } from './report-app-status/report-app-status.component';
import {
    ReportCarrierwiseDelayedDeliveryComponent,
} from './report-carrierwise-delayed-delivery/report-carrierwise-delayed-delivery.component';
import { ReportCasespercityComponent } from './report-casespercity/report-casespercity.component';
import { ReportCasesperhospitalComponent } from './report-casesperhospital/report-casesperhospital.component';
import { ReportCasespersurgeryComponent } from './report-casespersurgery/report-casespersurgery.component';
import {
    ReportLocationToZoneMappingComponent,
} from './report-location-to-zone-mapping/report-location-to-zone-mapping.component';
import {
    ReportMostUsedEquipmentPerSurgeonComponent,
} from './report-most-used-equipment-per-surgeon/report-most-used-equipment-per-surgeon.component';
import { ReportOrdersPerSurgeonComponent } from './report-orders-per-surgeon/report-orders-per-surgeon.component';
import {
    ReportOrdersWithUnshippedProductsComponent,
} from './report-orders-with-unshipped-products/report-orders-with-unshipped-products.component';
import { ReportPartialShipmentsComponent } from './report-partial-shipments/report-partial-shipments.component';
import {
    ReportProductsReadyToDispatchComponent,
} from './report-products-ready-to-dispatch/report-products-ready-to-dispatch.component';
import {
    ReportSalesrepWiseProductOrderComponent,
} from './report-salesrep-wise-product-order/report-salesrep-wise-product-order.component';
import {
    ReportSensorConnectionStatusComponent,
} from './report-sensor-connection-status/report-sensor-connection-status.component';
import { ReportShipmentDueComponent } from './report-shipment-due/report-shipment-due.component';
import {
    ReportShipmentsHardDeliveredByWebAdminComponent,
} from './report-shipments-hard-delivered-by-web-admin/report-shipments-hard-delivered-by-web-admin.component';
import { ReportShipmentsInJeopardyComponent } from './report-shipments-in-jeopardy/report-shipments-in-jeopardy.component';
import { ReportSkuSensorMappingComponent } from './report-sku-sensor-mapping/report-sku-sensor-mapping.component';
import { UserLocatorComponent } from './user-locator/user-locator.component';

import { ReportStationaryShipmentsComponent } from './report-stationary-shipments/report-stationary-shipments.component';
import {
    ReportSurgeryDatePassedOpenCasesComponent,
} from './report-surgery-date-passed-open-cases/report-surgery-date-passed-open-cases.component';
import { ReportUndeliveredProductsComponent } from './report-undelivered-products/report-undelivered-products.component';
import { UserLocatorHistoryComponent } from './user-locator-history/user-locator-history.component';
import { AuthGuard } from '../core/authorization/shared/auth-guard.service';
import { environment } from '../../environments/environment';
import { UserEntranceComponent } from './user-entrance/user-entrance.component';
import { UserEntranceHistoryComponent } from './user-entrance-history/user-entrance-history.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { SensorLocatorHistoryComponent } from './sensor-locator-history/sensor-locator-history.component';
import { SensorLocatorComponent } from './sensor-locator/sensor-locator.component';
import { ReportEventReportComponent } from './report-event-report/report-event-report.component';
import { ReportTourReportComponent } from './report-tour-report/report-tour-report.component';
import { ReportEventDetailsReportComponent } from './report-event-report/report-event-details-report.component';
import { ReportIncidentReportComponent } from './report-incident-report/report-incident-report.component';
import { ReportIncidentDetailsReportComponent } from './report-incident-report/report-incident-details-report.component';
import { ReportDeviceTourStatsComponent } from './report-device-tour-stats/report-device-tour-stats.component';
import { ReportGuardTourStatsComponent } from './report-guard-tour-stats/report-guard-tour-stats.component';

export const routes: Routes = [
  {
    component: PageComponent,
    path: 'reports',
    children: [
      {
        path: 'tourreport', component: ReportTourReportComponent,
        data: { title: 'Akwa - Tour Report', resource: 'Tour Report', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'tourevents', component: ReportEventReportComponent,
        data: { title: 'Akwa - Events Report', resource: 'Event Report', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'tourevents/:id', component: ReportEventDetailsReportComponent,
        data: { title: 'Akwa - Event Details Report', resource: 'Event Report', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'tourincidents', component: ReportIncidentReportComponent,
        data: { title: 'Akwa - Incidents Report', resource: 'Event Report', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'tourincidents/:id', component: ReportIncidentDetailsReportComponent,
        data: { title: 'Akwa - Incidents Report', resource: 'Event Report', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'orderspersurgery', component: ReportCasespersurgeryComponent,
        data: { title: 'Akwa - Orders By Surgery Type', resource: 'Orders By Surgery Type', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'orderspercity', component: ReportCasespercityComponent,
        data: { title: 'Akwa - Orders Per City', resource: 'Orders Per City', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'ordersperhospital', component: ReportCasesperhospitalComponent,
        data: { title: 'Akwa - Orders Per Hospital', resource: 'Orders Per Hospital', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentscountbylocation', component: ReporShipmentsCountByLocationComponent,
        data: { title: 'Akwa - Orders Per Hospital', resource: 'Location-Wise Internal V/S External Delivered Shipments', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'ordersnotclosed', component: ReportSurgeryDatePassedOpenCasesComponent,
        data: { title: 'Akwa - Open Orders - Surgery Date Passed', resource: 'Open Orders - Surgery Date Passed', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentdeliverytime', component: ReporShipmentDeliveryTimeComponent,
        data: { title: 'Akwa - Total Time Taken For Shipment Deliveries', resource: 'Total Time Taken For Shipment Deliveries', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'unshippedproducts', component: ReportOrdersWithUnshippedProductsComponent,
        data: { title: 'Akwa - Orders With Unshipped Products', resource: 'Orders With Unshipped Products', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productsensorhistory/:id', component: ReporSkuSensorMappingHistoryComponent,
        data: { title: 'Akwa - Product Sensor Mapping History', resource: 'Product Sensor Mapping', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productsnotdelivered', component: ReportUndeliveredProductsComponent,
        data: { title: 'Akwa - Undelivered Products', resource: 'Undelivered Products', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'orderspersurgeon', component: ReportOrdersPerSurgeonComponent,
        data: { title: 'Akwa - Orders Per Surgeon', resource: 'Orders Per Surgeon', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentsdue', component: ReportShipmentDueComponent,
        data: { title: 'Akwa - Shipments Due', resource: 'Shipments Due', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentdeliverytimecarrier', component: ReportCarrierwiseDelayedDeliveryComponent,
        data: { title: 'Akwa - Carrier wise Delayed Delivery', resource: 'Carrier-Wise Delayed Deliveries', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'locationzones', component: ReportLocationToZoneMappingComponent,
        data: { title: 'Akwa - Location To Check Points Mapping', resource: 'Location To Check Points Mapping', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentharddelivered', component: ReportShipmentsHardDeliveredByWebAdminComponent,
        data: { title: 'Akwa - Shipments Hard Delivered By Web Admin', resource: 'Shipment Hard Delivered By Web Admin', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'shipmentsinjeopardy', component: ReportShipmentsInJeopardyComponent,
        data: { title: 'Akwa - Shipments In Jeopardy', resource: 'Shipments In Jeopardy', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'stationaryshipment', component: ReportStationaryShipmentsComponent,
        data: { title: 'Akwa - Stationary Shipments', resource: 'Stationary Shipments', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productsensor', component: ReportSkuSensorMappingComponent,
        data: { title: 'Akwa - Product Sensor Mapping', resource: 'Product Sensor Mapping', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productsordered', component: ReportSalesrepWiseProductOrderComponent,
        data: { title: 'Akwa - Sales rep - Wise Products Order', resource: 'Sales Representative-Wise Product Orders', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'partialshipments', component: ReportPartialShipmentsComponent,
        data: { title: 'Akwa - Partial Shipments', resource: 'Partial Shipments', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productlocator', component: ProductLocatorComponent,
        data: { title: 'Akwa - Product Locator', resource: 'Product Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productlocatorhistory/:id', component: ProductLocatorHistoryComponent,
        data: { title: 'Akwa - Product Locator History', resource: 'Product Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'sensorstatus', component: ReportSensorConnectionStatusComponent,
        data: { title: 'Akwa - Sensor Connection Status', resource: 'Sensor Connection Status', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'productsreadytodispatch', component: ReportProductsReadyToDispatchComponent,
        data: { title: 'Akwa - Products Ready To Dispatch', resource: 'Products Ready To Dispatch', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'appstatus', component: ReportAppStatusComponent,
        data: { title: 'Akwa - Device Status', resource: 'Device Status', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'devicelocator', component: DeviceLocatorComponent,
        data: { title: 'Akwa - Device Locator', resource: 'Device Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'devicelocatorhistory/:id', component: DeviceLocatorHistoryComponent,
        data: { title: 'Akwa - Device Locator History', resource: 'Device Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'mostusedequipmentpersurgeon', component: ReportMostUsedEquipmentPerSurgeonComponent,
        data: { title: 'Akwa - Most Used Products Per Surgeon', resource: 'Most Used Products Per Surgeon', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'userlocator', component: UserLocatorComponent,
        data: { title: 'Akwa - ' + environment.userType + ' Locator', resource: environment.userType + ' Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'userlocatorhistory/:id', component: UserLocatorHistoryComponent,
        data: { title: 'Akwa - ' + environment.userType + ' Locator History', resource: environment.userType + ' Locator', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'entrance', component: UserEntranceComponent,
        data: { title: 'Akwa - ' + environment.userType + ' Attendance', resource: environment.userType + ' Attendance', type: 'list' },
        // canActivate: [AuthGuard],
      },
      {
        path: 'entrancehistory/:userId/:locationType/:location/:dt', component: UserEntranceHistoryComponent,
        data: { title: 'Akwa - ' + environment.userType + ' Attendance History', 
          resource: environment.userType + ' Attendance History', type: 'list' },
        // canActivate: [AuthGuard],
      },
      {
        path: 'loginhistory', component: LoginHistoryComponent,
        data: { title: 'Akwa - Login History', resource: 'Login History', type: 'list' }
        // canActivate: [AuthGuard],
      },
      {
        path: 'sensorlocator', component: SensorLocatorComponent,
        data: { title: 'Akwa - Sensor Locator', resource: 'Sensor Locator', type: 'list' },
        // canActivate: [AuthGuard],
      },
      {
        path: 'sensorlocatorhistory/:id', component: SensorLocatorHistoryComponent,
        data: { title: 'Akwa - Sensor Locator History', resource: 'Sensor Locator', type: 'list' },
        // canActivate: [AuthGuard],
      },
      {
        path: 'tourdetail/:id', component: TourDetailComponent,
        data: { title: 'Akwa - Tour Detail', resource: 'Tour Detail', type: 'list' },
        // canActivate: [AuthGuard],
      },
      {
        path: 'device-tour-stats', component: ReportDeviceTourStatsComponent,
        data: { title: 'Akwa - Device Tour Stats', resource: 'Device Tour Stats', type: 'list' },
        canActivate: [AuthGuard],
      },
      {
        path: 'guard-tour-stats', component: ReportGuardTourStatsComponent,
        data: { title: 'Akwa - Guard Tour Stats', resource: 'Guard Tour Stats', type: 'list' },
        canActivate: [AuthGuard],
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);


