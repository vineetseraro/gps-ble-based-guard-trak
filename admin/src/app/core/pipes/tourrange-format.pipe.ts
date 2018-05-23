import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'TourRangeFormat'
})
export class TourRangeFormatPipe implements PipeTransform {
  transform(val, range) {
    switch (range) {
      case 'day':
        return moment(val.year + '-' + val.month + '-' + val.day ).format('DD MMM Y');
      case 'week':
        if (typeof val.week !== 'undefined') {
          val.week = val.week + 1;
          const startDate = moment([val.year]).isoWeek(val.week).startOf('isoWeek').format('DD MMM Y');
          const endDate = moment([val.year]).isoWeek(val.week).endOf('isoWeek').format('DD MMM Y');
          return startDate + ' to ' + endDate;
        }
        return '';
      case 'month':
        return moment(val.year + '-' + val.month + '-01' ).format('MMM Y');
      case 'all':
        return 'NA';
    }
  }
}
