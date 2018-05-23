import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { environment } from '../../../../../../environments/environment';
import { LocatorType } from './locatortype.interface';

/**
 * DeviceLocator Class process according to device data
 *
 * @export
 * @class DeviceLocator
 * @implements {LocatorType}
 */
@Injectable()
export class DeviceLocator implements LocatorType {
  idValue = '';
  constructor() { }

  /**
   * Get device id data
   *
   * @param {*} data
   * @returns {string}
   * @memberof DeviceLocator
   */
  getIdField(data: any): string {
    this.idValue = data.deviceInfo.id;
    return this.idValue;
  }

  /**
   * Get field for show on map
   *
   * @param {*} data
   * @returns {*}
   * @memberof DeviceLocator
   */
  getFields(data: any): any {
    const datePipe = new DatePipe('en-US');
    const dtvalue = datePipe.transform(data.ts, environment.mapDateTimeFormat);
    return [
        { label : 'Code', name : 'code', value : data.deviceInfo.code },
        { label : 'Name', name : 'name', value : data.deviceInfo.name },
        { label : 'Sensor', name : 'sensor', value : data.sensors.name },
        { label : 'Last Tracked', name : 'dt', value : dtvalue }
    ];
  }

  /**
   * Get device route page url
   *
   * @returns {string}
   * @memberof DeviceLocator
   */
  getDetailsUrl(): string {
    return '/map/deviceroute/' + this.idValue;
  }

  /**
   * Get info window content ( NOT USED)
   *
   * @returns {string}
   * @memberof DeviceLocator
   */
  getInfoContent(): string {
    return '';
  }

  /**
   * Check if provided device id exists in data
   *
   * @param {string} itemId
   * @param {*} data
   * @returns {boolean}
   * @memberof DeviceLocator
   */
  isExists(itemId: string, data: any): boolean {
    if (typeof data.deviceInfo.id !== 'undefined') {
      if (data.deviceInfo.id === itemId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get Data Source
   *
   * @returns {string}
   * @memberof DeviceLocator
   */
  getDataSource() {
    return environment.iotTopics.device;
  }

}
