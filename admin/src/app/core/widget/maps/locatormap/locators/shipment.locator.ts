import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../../environments/environment';
import { LocatorType } from './locatortype.interface';

/**
 * ShipmentLocator Class process according to product data
 *
 * @export
 * @class ShipmentLocator
 * @implements {LocatorType}
 */
@Injectable()
export class ShipmentLocator implements LocatorType {
  idValue = '';
  constructor() { }

  /**
   * Get device id data
   *
   * @param {*} data
   * @returns {string}
   * @memberof ShipmentLocator
   */
  getIdField(data: any): string {
    this.idValue = data.sensors.shipment.id;
    return this.idValue;
  }

  /**
   * Get field for show on map
   *
   * @param {*} data
   * @returns {*}
   * @memberof ShipmentLocator
   */
  getFields(data: any): any {
    const datePipe = new DatePipe('en-US');
    const dtvalue = datePipe.transform(data.ts, environment.mapDateTimeFormat);
    return [
        { label : 'Shipment No', name : 'code', value : data.sensors.shipment.code },
        // { label : 'Sensor', name : 'sensor', value : data.sensors.name },
        { label : 'Last Tracked', name : 'dt', value : dtvalue },
        { label : '--', name : 'status', value : data.sensors.shipment.status },
        { label : 'Status', name : 'statusLabel', value : data.sensors.shipment.statusLabel }
    ];
  }

  /**
   * Get shipment route page url
   *
   * @returns {string}
   * @memberof ShipmentLocator
   */
  getDetailsUrl(): string {
    return '/shipments/' + this.idValue;
  }

  /**
   * Get info window content ( NOT USED)
   *
   * @returns {string}
   * @memberof ShipmentLocator
   */
  getInfoContent(): string {
    return '';
  }

  /**
   * Check if provided shipment id exists in data
   *
   * @param {string} itemId
   * @param {*} data
   * @returns {boolean}
   * @memberof ShipmentLocator
   */
  isExists(itemId: string, data: any): boolean {
    if (typeof data.sensors.shipment !== 'undefined') {
      if (data.sensors.shipment.id === itemId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get Data Source
   *
   * @returns {string}
   * @memberof ShipmentLocator
   */
  getDataSource() {
    return environment.iotTopics.shipment;
  }

}
