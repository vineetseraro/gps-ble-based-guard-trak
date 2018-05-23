import { GadgetBeaconModelDistributionComponent } from './gadget-beacon-model-distribution/gadget-beacon-model-distribution.component';
import { GadgetBeaconFirmwareDistributionComponent } from './gadget-beacon-firmware-distribution/gadget-beacon-firmware-distribution.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GadgetOrderStatusComponent } from './gadget-order-status/gadget-order-status.component';
import { GadgetShipmentStatusComponent } from './gadget-shipment-status/gadget-shipment-status.component';
import { D3chartModule } from '../core/d3chart/d3chart.module';
import { GadgetOrdersBySurgeryTypeComponent } from './gadget-orders-by-surgery-type/gadget-orders-by-surgery-type.component';
import { GadgetOrdersPerSurgeonComponent } from './gadget-orders-per-surgeon/gadget-orders-per-surgeon.component';
import { GadgetOrdersPerSalesRepComponent } from './gadget-orders-per-sales-rep/gadget-orders-per-sales-rep.component';
import { GadgetShipmentsPerCarrierComponent } from './gadget-shipments-per-carrier/gadget-shipments-per-carrier.component';
import { GadgetOrdersPerHospitalComponent } from './gadget-orders-per-hospital/gadget-orders-per-hospital.component';
import { GadgetUpcomingOrderStatusComponent } from './gadget-upcoming-order-status/gadget-upcoming-order-status.component';
import { GadgetUpcomingShipmentsStatusComponent } from './gadget-upcoming-shipments-status/gadget-upcoming-shipments-status.component';
import { GadgetShipmentsDueComponent } from './gadget-shipments-due/gadget-shipments-due.component';
import { GadgetOpenServiceRequestsComponent } from './gadget-open-service-requests/gadget-open-service-requests.component';
import { GadgetAppStatusComponent } from './gadget-app-status/gadget-app-status.component';
import { GadgetOrderDueComponent } from './gadget-order-due/gadget-order-due.component';
import { GadgetTotalOrdersShipmentsComponent } from './gadget-total-orders-shipments/gadget-total-orders-shipments.component';
import { GadgetShipmentsInJeopardyComponent } from './gadget-shipments-in-jeopardy/gadget-shipments-in-jeopardy.component';
import { GadgetOrdersPerCityComponent } from './gadget-orders-per-city/gadget-orders-per-city.component';
import { CalendarModule } from 'primeng/primeng';
import { GadgetBeaconLastSeenComponent } from 'app/gadgets/gadget-beacon-last-seen/gadget-beacon-last-seen.component';
import { GadgetBeaconBatteryStatusComponent } from 'app/gadgets/gadget-beacon-battery-status/gadget-beacon-battery-status.component';
import { WidgetModule } from '../core/widget/widget.module';

@NgModule({
  imports: [
    CommonModule, 
    D3chartModule, 
    CalendarModule,
    WidgetModule
  ],
  declarations: [
    GadgetOrderStatusComponent,
    GadgetShipmentStatusComponent,
    GadgetOrdersBySurgeryTypeComponent,
    GadgetOrdersPerSurgeonComponent,
    GadgetOrdersPerSalesRepComponent,
    GadgetShipmentsPerCarrierComponent,
    GadgetOrdersPerHospitalComponent,
    GadgetUpcomingOrderStatusComponent,
    GadgetUpcomingShipmentsStatusComponent,
    GadgetShipmentsDueComponent,
    GadgetOpenServiceRequestsComponent,
    GadgetAppStatusComponent,
    GadgetOrderDueComponent,
    GadgetTotalOrdersShipmentsComponent,
    GadgetShipmentsInJeopardyComponent,
    GadgetOrdersPerCityComponent,
    GadgetBeaconFirmwareDistributionComponent,
    GadgetBeaconModelDistributionComponent,
    GadgetBeaconLastSeenComponent,
    GadgetBeaconBatteryStatusComponent
  ],
  exports: [
    GadgetOrderStatusComponent,
    GadgetShipmentStatusComponent,
    GadgetOrdersBySurgeryTypeComponent,
    GadgetOrdersPerSurgeonComponent,
    GadgetOrdersPerSalesRepComponent,
    GadgetShipmentsPerCarrierComponent,
    GadgetOrdersPerHospitalComponent,
    GadgetUpcomingOrderStatusComponent,
    GadgetUpcomingShipmentsStatusComponent,
    GadgetShipmentsDueComponent,
    GadgetOpenServiceRequestsComponent,
    GadgetAppStatusComponent,
    GadgetOrderDueComponent,
    GadgetTotalOrdersShipmentsComponent,
    GadgetShipmentsInJeopardyComponent,
    GadgetOrdersPerCityComponent,
    GadgetBeaconFirmwareDistributionComponent,
    GadgetBeaconModelDistributionComponent,
    GadgetBeaconLastSeenComponent,
    GadgetBeaconBatteryStatusComponent
  ],
  entryComponents: [
    GadgetOrderStatusComponent,
    GadgetShipmentStatusComponent,
    GadgetOrdersBySurgeryTypeComponent,
    GadgetOrdersPerSurgeonComponent,
    GadgetOrdersPerSalesRepComponent,
    GadgetShipmentsPerCarrierComponent,
    GadgetOrdersPerHospitalComponent,
    GadgetUpcomingOrderStatusComponent,
    GadgetUpcomingShipmentsStatusComponent,
    GadgetShipmentsDueComponent,
    GadgetOpenServiceRequestsComponent,
    GadgetAppStatusComponent,
    GadgetOrderDueComponent,
    GadgetTotalOrdersShipmentsComponent,
    GadgetShipmentsInJeopardyComponent,
    GadgetOrdersPerCityComponent,
    GadgetBeaconFirmwareDistributionComponent,
    GadgetBeaconModelDistributionComponent,
    GadgetBeaconLastSeenComponent,
    GadgetBeaconBatteryStatusComponent
  ]
})
export class GadgetsModule {}
