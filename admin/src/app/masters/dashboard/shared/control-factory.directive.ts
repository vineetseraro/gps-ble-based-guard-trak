import { GadgetBeaconBatteryStatusComponent } from './../../../gadgets/gadget-beacon-battery-status/gadget-beacon-battery-status.component';
import { GadgetBeaconLastSeenComponent } from './../../../gadgets/gadget-beacon-last-seen/gadget-beacon-last-seen.component';
import {
  ComponentFactoryResolver,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef
} from '@angular/core';

import { GadgetAppStatusComponent } from '../../../gadgets/gadget-app-status/gadget-app-status.component';
import { GadgetOpenServiceRequestsComponent } from '../../../gadgets/gadget-open-service-requests/gadget-open-service-requests.component';
import { GadgetOrderDueComponent } from '../../../gadgets/gadget-order-due/gadget-order-due.component';
import { GadgetOrderStatusComponent } from '../../../gadgets/gadget-order-status/gadget-order-status.component';
import { GadgetOrdersBySurgeryTypeComponent } from '../../../gadgets/gadget-orders-by-surgery-type/gadget-orders-by-surgery-type.component';
import { GadgetOrdersPerCityComponent } from '../../../gadgets/gadget-orders-per-city/gadget-orders-per-city.component';
import { GadgetOrdersPerHospitalComponent } from '../../../gadgets/gadget-orders-per-hospital/gadget-orders-per-hospital.component';
import { GadgetOrdersPerSalesRepComponent } from '../../../gadgets/gadget-orders-per-sales-rep/gadget-orders-per-sales-rep.component';
import { GadgetOrdersPerSurgeonComponent } from '../../../gadgets/gadget-orders-per-surgeon/gadget-orders-per-surgeon.component';
import { GadgetShipmentStatusComponent } from '../../../gadgets/gadget-shipment-status/gadget-shipment-status.component';
import { GadgetShipmentsDueComponent } from '../../../gadgets/gadget-shipments-due/gadget-shipments-due.component';
import { GadgetShipmentsInJeopardyComponent } from '../../../gadgets/gadget-shipments-in-jeopardy/gadget-shipments-in-jeopardy.component';
import { GadgetShipmentsPerCarrierComponent } from '../../../gadgets/gadget-shipments-per-carrier/gadget-shipments-per-carrier.component';
import { GadgetTotalOrdersShipmentsComponent } from '../../../gadgets/gadget-total-orders-shipments/gadget-total-orders-shipments.component';
import { GadgetUpcomingOrderStatusComponent } from '../../../gadgets/gadget-upcoming-order-status/gadget-upcoming-order-status.component';
import { GadgetUpcomingShipmentsStatusComponent } from '../../../gadgets/gadget-upcoming-shipments-status/gadget-upcoming-shipments-status.component';
import { GadgetBeaconModelDistributionComponent } from 'app/gadgets/gadget-beacon-model-distribution/gadget-beacon-model-distribution.component';
import { GadgetBeaconFirmwareDistributionComponent } from 'app/gadgets/gadget-beacon-firmware-distribution/gadget-beacon-firmware-distribution.component';

const typeMap = {
  'gadget-upcoming-shipments-status': GadgetUpcomingShipmentsStatusComponent,
  'gadget-upcoming-order-status': GadgetUpcomingOrderStatusComponent,
  'gadget-orders-per-hospital': GadgetOrdersPerHospitalComponent,
  'gadget-shipments-per-carrier': GadgetShipmentsPerCarrierComponent,
  'gadget-orders-per-sales-rep': GadgetOrdersPerSalesRepComponent,
  'gadget-orders-per-surgeon': GadgetOrdersPerSurgeonComponent,
  'gadget-orders-by-surgery-type': GadgetOrdersBySurgeryTypeComponent,
  'gadget-order-status': GadgetOrderStatusComponent,
  'gadget-shipment-status': GadgetShipmentStatusComponent,
  'gadget-shipment-due': GadgetShipmentsDueComponent,
  'gadget-open-service-request': GadgetOpenServiceRequestsComponent,
  'gadget-app-status': GadgetAppStatusComponent,
  'gadget-order-due': GadgetOrderDueComponent,
  'gadget-total-orders-shipments': GadgetTotalOrdersShipmentsComponent,
  'gadget-shipments-in-jeopardy': GadgetShipmentsInJeopardyComponent,
  'gadget-orders-per-city': GadgetOrdersPerCityComponent,
  'gadget-beacon-model-distribution': GadgetBeaconModelDistributionComponent,
  'gadget-beacon-firmware-distribution': GadgetBeaconFirmwareDistributionComponent,
  'gadget-beacon-last-seen': GadgetBeaconLastSeenComponent,
  'gadget-beacon-battery-status': GadgetBeaconBatteryStatusComponent
};

@Directive({
  selector: '[ctrl-factory]'
})
export class ControlFactoryDirective implements OnChanges {
  @Input() model: any;
  componentRef: any;
  init = false;

  constructor(private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver) {}

  create(comp: any) {
    const factory = this.resolver.resolveComponentFactory(comp);
    const compRef = this.vcRef.createComponent(factory);

    (<any>compRef).instance.model = this.model;

    if (this.componentRef) {
      this.componentRef.destroy();
    }

    this.componentRef = compRef;
    this.init = true;
  }

  ngOnChanges() {
    if (!this.model || this.init) return;
    const comp = typeMap[this.model.gadgetCode];
    if (comp) {
      this.create(comp);
    }
  }
  public ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
