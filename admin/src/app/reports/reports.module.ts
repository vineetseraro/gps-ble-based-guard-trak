import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
} from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

import { EmptyDataPipe } from '../core/pipes/empty-data.pipe';
import { DurationFormatPipe } from '../core/pipes/duration-format.pipe';

import { WidgetModule } from '../core/widget/widget.module';
import { DeviceLocatorHistoryMapComponent } from './device-locator-history/device-locator-history-map.component';
import { DeviceLocatorHistoryComponent } from './device-locator-history/device-locator-history.component';
import { DeviceLocatorMapComponent } from './device-locator/device-locator-map.component';
import { DeviceLocatorComponent } from './device-locator/device-locator.component';
import { UserLocatorMapComponent } from './user-locator/user-locator-map.component';
import { ProductLocatorHistoryMapComponent } from './product-locator-history/product-locator-history-map.component';
import { ProductLocatorHistoryComponent } from './product-locator-history/product-locator-history.component';
import { ProductLocatorMapComponent } from './product-locator/product-locator-map.component';
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
    ReportShipmentdeliverytimecarrierComponent,
} from './report-shipmentdeliverytimecarrier/report-shipmentdeliverytimecarrier.component';
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
import { routing } from './reports-routing.module';
import { ShipmentLocatorMapComponent } from './shipment-locator/shipment-locator-map.component';

import { UserLocatorHistoryComponent } from './user-locator-history/user-locator-history.component';
import { UserEntranceComponent } from './user-entrance/user-entrance.component';
import { UserEntranceHistoryComponent } from './user-entrance-history/user-entrance-history.component';
import { LoginHistoryComponent } from './login-history/login-history.component';

import { SensorLocatorHistoryComponent } from './sensor-locator-history/sensor-locator-history.component';
import { SensorLocatorComponent } from './sensor-locator/sensor-locator.component';

import { TourLocatorMapComponent } from './tour-locator/tour-locator-map.component';
import { ReportTourReportComponent } from './report-tour-report/report-tour-report.component';
import { ReportEventReportComponent } from './report-event-report/report-event-report.component';
import { EventDirective } from '../themes/stryker/directives/event.directive';
import { TourDetailComponent } from './report-tour-report/tourdetail.component';
import { ReportEventDetailsReportComponent } from './report-event-report/report-event-details-report.component';
import { ReportIncidentReportComponent } from './report-incident-report/report-incident-report.component';
import { ReportIncidentDetailsReportComponent } from './report-incident-report/report-incident-details-report.component';
import { ReportDeviceTourStatsComponent } from './report-device-tour-stats/report-device-tour-stats.component';
import { ReportIncidentDetailsMapComponent } from './report-incident-report/report-incident-details-map.component';
import { ReportGuardTourStatsComponent } from './report-guard-tour-stats/report-guard-tour-stats.component';
import { TourIdFormatPipe } from '../core/pipes/tourid-format.pipe';
import { DeviceFormatPipe } from '../core/pipes/device-format.pipe';
import { TourRangeFormatPipe } from '../core/pipes/tourrange-format.pipe';


@NgModule({
    imports: [
        routing,
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        DataTableModule,
        DialogModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextareaModule,
        MultiSelectModule,
        PanelModule,
        PasswordModule,
        RadioButtonModule,
        SharedModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        TabViewModule,
        ToggleButtonModule,
        FormsModule,
        WidgetModule,
        CommonModule
    ],
    declarations: [
        ReportAppStatusComponent,
        ReportShipmentdeliverytimecarrierComponent,
        ReportCasespersurgeryComponent,
        ReportCasespercityComponent,
        ReportCasesperhospitalComponent,
        ReportSurgeryDatePassedOpenCasesComponent,
        ReportOrdersWithUnshippedProductsComponent,
        ReportUndeliveredProductsComponent,
        ReportOrdersPerSurgeonComponent,
        ReportShipmentDueComponent,
        ReportCarrierwiseDelayedDeliveryComponent,
        ReportLocationToZoneMappingComponent,
        ReportShipmentsHardDeliveredByWebAdminComponent,
        ReportShipmentsInJeopardyComponent,
        ReportStationaryShipmentsComponent,
        ReportSalesrepWiseProductOrderComponent,
        ReportPartialShipmentsComponent,
        ProductLocatorComponent,
        ProductLocatorHistoryComponent,
        ReportSensorConnectionStatusComponent,
        ProductLocatorMapComponent,
        ProductLocatorHistoryMapComponent,
        DeviceLocatorComponent,
        DeviceLocatorMapComponent,
        DeviceLocatorHistoryComponent,
        DeviceLocatorHistoryMapComponent,
        EmptyDataPipe,
        DurationFormatPipe,
        ReportProductsReadyToDispatchComponent,
        ReportSkuSensorMappingComponent,
        ReporSkuSensorMappingHistoryComponent,
        ReporShipmentDeliveryTimeComponent,
        ReporShipmentsCountByLocationComponent,
        ShipmentLocatorMapComponent,
        ReportMostUsedEquipmentPerSurgeonComponent,
        UserLocatorHistoryComponent,
        UserLocatorMapComponent,
        UserLocatorComponent,
        UserEntranceComponent,
        UserEntranceHistoryComponent,
        LoginHistoryComponent,
        SensorLocatorHistoryComponent,
        SensorLocatorComponent,
        TourLocatorMapComponent,
        ReportTourReportComponent,
        ReportEventReportComponent,
        EventDirective,
        TourDetailComponent,
        ReportEventDetailsReportComponent,
        ReportIncidentReportComponent,
        ReportIncidentDetailsReportComponent,
        TourIdFormatPipe,
        DeviceFormatPipe,
        TourRangeFormatPipe,
        ReportDeviceTourStatsComponent,
        ReportIncidentDetailsMapComponent,
        ReportGuardTourStatsComponent
    ],
    exports: [
        ProductLocatorMapComponent,
        ProductLocatorHistoryMapComponent,
        DeviceLocatorMapComponent,
        DeviceLocatorHistoryMapComponent,
        ReportAppStatusComponent,
        ShipmentLocatorMapComponent,
        UserLocatorHistoryComponent,
        UserLocatorMapComponent,
        UserLocatorComponent,
        UserEntranceComponent,
        UserEntranceHistoryComponent,
        LoginHistoryComponent,
        TourLocatorMapComponent,
        ReportEventDetailsReportComponent,
        ReportIncidentReportComponent,
        ReportIncidentDetailsReportComponent,
        EmptyDataPipe,
        DeviceFormatPipe,
        TourRangeFormatPipe,
        ReportDeviceTourStatsComponent,
        ReportIncidentDetailsMapComponent,
        ReportGuardTourStatsComponent
    ]
})


export class ReportsModule { }
