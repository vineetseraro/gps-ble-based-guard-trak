import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Rx';
import { LocatorType } from './locatortype.interface';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment';

/**
 * UserLocator Class process according to product data
 *
 * @export
 * @class UserLocator
 * @implements {LocatorType}
 */
@Injectable()
export class UserLocator implements LocatorType {
  idValue = '';
  code = '';
  constructor() { }

  /**
   * Get device id data
   *
   * @param {*} data
   * @returns {string}
   * @memberof UserLocator
   */
  getIdField(data: any): string {
    this.idValue = data.sensors.user.id;
    this.code = data.sensors.user.code;
    return this.idValue;
  }

  /**
   * Get field for show on map
   *
   * @param {*} data
   * @returns {*}
   * @memberof UserLocator
   */
  getFields(data: any): any {
    const datePipe = new DatePipe('en-US');
    const dtvalue = datePipe.transform(data.ts, environment.mapDateTimeFormat);
    return [
        { label : 'User Name', name : 'code', value : data.sensors.user.name },
        { label : 'Last Tracked', name : 'dt', value : dtvalue }
    ];
  }

  /**
   * Get shipment route page url
   *
   * @returns {string}
   * @memberof EmployeeLocator
   */
  getDetailsUrl(): string {
    return '/reports/userlocatorhistory/' + this.idValue;
  }

  /**
   * Get info window content ( NOT USED)
   *
   * @returns {string}
   * @memberof EmployeeLocator
   */
  getInfoContent(): string {
    return '';
  }

  /**
   * Check if provided employee id exists in data
   *
   * @param {string} employeeId
   * @param {*} data
   * @returns {boolean}
   * @memberof UserLocator
   */
  isExists(employeeId: string, data: any): boolean {
    if (typeof data.sensors.user !== 'undefined') {
      if (data.sensors.user.id === employeeId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get Data Source
   *
   * @returns {string}
   * @memberof UserLocator
   */
  getDataSource() {
    return environment.iotTopics.user;
  }

}
