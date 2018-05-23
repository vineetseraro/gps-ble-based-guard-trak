import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { MobileLogsTrackingModel } from './mobilelogs-tracking.model';
import { PointLocationTrackingModel } from './pointlocation-tracking.model';
import { ProductTrackingModel } from './product-tracking.model';

@Injectable()
export class DiagnosticsService {

  // serviceUrl = 'report' + environment.serverEnv;
  serviceUrl = 'trackingreports' + environment.serverEnv ;

  constructor(private akRestService: HttpRestService) { }

  /**
   * Get Product Tracking Record Lists
   */
  productTracking(query: string): Observable<ProductTrackingModel> {
    return this.akRestService.get(this.serviceUrl + '/product-tracking' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get RawLocation Tracking Record Lists
   */
  rawSensorsTracking(query: string) {
    return this.akRestService.get(this.serviceUrl + '/rawsensors-tracking' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get PointLocation Tracking Record Lists
   */
  pointStatusTracking(query: string): Observable<PointLocationTrackingModel> {
    return this.akRestService.get(this.serviceUrl + '/pointstatus-tracking' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get PointSensor Tracking Record Lists
   */
  mobileLogsTracking(query: string): Observable<MobileLogsTrackingModel> {
    return this.akRestService.get(this.serviceUrl + '/mobilelogs' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get RawLocation Tracking Record Lists
   */
  rawLocationTracking(query: string) {
    return this.akRestService.get(this.serviceUrl + '/pointmismatch-tracking' + query)
      .map((res:any) => res.json());
  }

  /**
   * Format Date
   * @param isodate
   */
  formatDate(isodate:any) {
      return isodate = moment(isodate).tz(window.localStorage.getItem('userTimeZone')).format('MM/DD/Y HH:mm:ss');
  }

  /**
   * Process Date to save
   * @param date
   */
  processDate(date:any) {
    if ( date === '' || date === null ) {
      return null;
    } else {
        if ( !moment(date, moment.ISO_8601).isValid() ) {
          date = moment(date, 'MM/DD/Y HH:mm:ss');
        }
        const dateObj = moment(date);
        dateObj.format();

        const newDateObj = moment.tz(
          dateObj.format('YYYY-MM-DDTHH:mm:ss.SSS'),
          moment.ISO_8601,
          window.localStorage.getItem('userTimeZone')
        );

        return newDateObj.format();
    }
  }


}
