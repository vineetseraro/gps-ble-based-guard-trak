import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../../environments/environment';
import { LocatorType } from './locatortype.interface';

/**
 * ProductLocator Class process according to product data
 *
 * @export
 * @class ProductLocator
 * @implements {LocatorType}
 */
@Injectable()
export class ProductLocator implements LocatorType {
  idValue = '';
  constructor() { }

  /**
   * Get device id data
   *
   * @param {*} data
   * @returns {string}
   * @memberof ProductLocator
   */
  getIdField(data: any): string {
    this.idValue = data.sensors.product.id;
    return this.idValue;
  }

  /**
   * Get field for show on map
   *
   * @param {*} data
   * @returns {*}
   * @memberof ProductLocator
   */
  getFields(data: any): any {
    const datePipe = new DatePipe('en-US');
    const dtvalue = datePipe.transform(data.ts, environment.mapDateTimeFormat);
    return [
        { label : 'Code', name : 'code', value : data.sensors.product.code },
        { label : 'Name', name : 'name', value : data.sensors.product.name },
        { label : 'Sensor', name : 'sensor', value : data.sensors.name },
        { label : 'Last Tracked', name : 'dt', value : dtvalue }
    ];
  }

  /**
   * Get product route page url
   *
   * @returns {string}
   * @memberof ProductLocator
   */
  getDetailsUrl(): string {
    return '/map/productroute/' + this.idValue;
  }

  /**
   * Get info window content ( NOT USED)
   *
   * @returns {string}
   * @memberof ProductLocator
   */
  getInfoContent(): string {
    return '';
  }

  /**
   * Check if provided product id exists in data
   *
   * @param {string} itemId
   * @param {*} data
   * @returns {boolean}
   * @memberof ProductLocator
   */
  isExists(itemId: string, data: any): boolean {
    if (typeof data.sensors.product !== 'undefined') {
      if (data.sensors.product.id === itemId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get Data Source
   *
   * @returns {string}
   * @memberof ProductLocator
   */
  getDataSource() {
    return environment.iotTopics.product;
  }


}
