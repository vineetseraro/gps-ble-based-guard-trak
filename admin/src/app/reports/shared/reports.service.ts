import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

import { environment } from '../../../environments/environment';

@Injectable()
export class ReportsService {

  serviceUrl = 'report' + environment.serverEnv;
  
  constructor() { }

  /**
   * Format Date
   * @param isodate
   */
  formatDate(isodate:any) {
    let userTimeZone:any = window.localStorage.getItem('userTimeZone');
    return isodate = moment(isodate).tz(userTimeZone).format('MM/DD/Y HH:mm');
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
          date = moment(date, 'MM/DD/Y HH:mm');
        }
        const dateObj = moment(date);
        dateObj.format();
        let userTimeZone:any = window.localStorage.getItem('userTimeZone');
        const newDateObj = moment.tz(
          dateObj.format('YYYY-MM-DDTHH:mm:ss.SSS'),
          moment.ISO_8601,
          userTimeZone
        );

        return newDateObj.format();
    }
  }


}
