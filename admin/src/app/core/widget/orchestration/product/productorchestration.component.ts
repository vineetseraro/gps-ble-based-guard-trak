import { Component, Input, OnInit } from '@angular/core';

import { OrderService } from './../../../../masters/orders/shared/order.service';
import { ShipmentItemOrchestration } from './../../../../masters/shipments/shared/shipment.model';
import { ShipmentService } from './../../../../masters/shipments/shared/shipment.service';
import { StringUtil } from './../../../string.util';

/**
 * productorchestration widget class
 *
 * @export
 * @class ProductOrchestrationComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-productorchestration-widget',
  templateUrl: './productorchestration.component.html',
  providers: [ShipmentService, OrderService]
})

export class ProductOrchestrationComponent implements OnInit {

  private _itemId = '';
  private _parentId = '';
  private _productParent = '';
  @Input()
  set productParent(productParent: string) {
    this._productParent = productParent;
  }
  @Input()
  set itemId(itemId: string) {
    this._itemId = itemId;
  }
  @Input()
  set parentId(parentId: string) {
    this._parentId = parentId;
  }
  loader = false;
  emptyMessage = '';
  itemOrchestration: ShipmentItemOrchestration[];
  totalOrchestrationRecords = 0;

  /**
   * Create an instance of ProductOrchestrationComponent.
   * @param {ShipmentService} shipmentService
   * @param {OrderService} orderService
   * @memberof ProductOrchestrationComponent
   */
  constructor(
    private orderService: OrderService
  ) {
  }

  /**
   *
   * @memberof ShipmentOrchestrationComponent
   */
  ngOnInit() {
    console.log(this._productParent);
    this.getOrderItemOrchestration();
  }


  /**
   * Function to get order item Orchestration
   * @memberof ShipmentOrchestrationComponent
   */
  getOrderItemOrchestration() {
    this.loader = true;
      if (this._itemId && this._parentId) {
          this.orderService.getOrderItemOrchestration(this._parentId, this._itemId).subscribe((data:any) => {
            const result = data.data;
            this.emptyMessage = StringUtil.emptyMessage;
            this.totalOrchestrationRecords = data.data.length;
            this.itemOrchestration = result;
            this.totalOrchestrationRecords = data.totalRecords;
            this.loader = false;
            },
            (error:any) => {
                this.emptyMessage = StringUtil.emptyMessage;
                if (error.code === 210) {
                    this.itemOrchestration = [];
                }
                this.loader = false;
            });
      } else {
          this.emptyMessage = StringUtil.emptyMessage;
      }
  }


}

