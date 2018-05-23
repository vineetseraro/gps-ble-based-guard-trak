import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'DurationFormat'
})
export class DurationFormatPipe implements PipeTransform {
  transform(val) {

    if ( val < 1000 ) {
      return ' -- ';
    } else {
      const arr = [];
      const durationObj = moment.duration(val);
      if ( durationObj.years() ) {
        arr.push(durationObj.years() + ' Years');
      }
      if ( durationObj.months() ) {
        arr.push(durationObj.months() + ' Months');
      }
      if ( durationObj.weeks() ) {
        arr.push(durationObj.weeks() + ' Weeks');
      }
      if ( durationObj.days() ) {
        arr.push(durationObj.days() + ' Days');
      }
      if ( durationObj.hours() ) {
        arr.push(durationObj.hours() + ' Hours');
      }
      if ( durationObj.minutes() ) {
        arr.push(durationObj.minutes() + ' Minutes');
      }
      if ( durationObj.seconds() ) {
        arr.push(durationObj.seconds() + ' Seconds');
      }
      return arr.join(', ');
    }
  }
}
