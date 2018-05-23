import { Component, Input, OnInit } from '@angular/core';

import { ShipmentOrchestration } from './../../../../masters/shipments/shared/shipment.model';
import { ShipmentService } from './../../../../masters/shipments/shared/shipment.service';
import { StringUtil } from './../../../string.util';

/**
 * ShipmentOrchestration widget class
 *
 * @export
 * @class ShipmentOrchestration
 * @implements {OnInit}
 */
@Component({
  selector: 'app-shipmentorchestration-widget',
  templateUrl: './shipmentorchestration.component.html',
  providers: [ShipmentService]
})

export class ShipmentOrchestrationComponent implements OnInit {

  private _shipmentId = '';
  // @Input('shipmentId') shipmentId: string;
  @Input()
  set shipmentId(shipmentId: string) {
    this._shipmentId = shipmentId;
  }
  loader = false;
  emptyMessage = '';
  shipmentOrchestration: ShipmentOrchestration[];
  totalOrchestrationRecords = 0;

  /**
   * Create an instance of ShipmentOrchestrationComponent.
   * @param {ShipmentService} shipmentService
   * @memberof ShipmentOrchestrationComponent
   */
  constructor(private shipmentService: ShipmentService) {
  }

  /**
   *
   * @memberof ShipmentOrchestrationComponent
   */
  ngOnInit() {
    this.getShipmentOrchestration();
  }


  /**
   * Function to get shipment Orchestration
   * @memberof ShipmentOrchestrationComponent
   */
  getShipmentOrchestration() {
    this.loader = true;
    if (this._shipmentId) {
        this.shipmentService.getShipmentOrchestration(this._shipmentId).subscribe((data:any) => {
          const result = data.data;
          this.emptyMessage = StringUtil.emptyMessage;
          this.totalOrchestrationRecords = data.data.length;
          this.shipmentOrchestration = result;
          this.totalOrchestrationRecords = data.totalRecords;
          this.loader = false;
          },
          (error:any) => {
              this.emptyMessage = StringUtil.emptyMessage;
              if (error.code === 210) {
                  this.shipmentOrchestration = [];
              }
              this.loader = false;
          });
    } else {
        this.emptyMessage = StringUtil.emptyMessage;
    }
  }


}

