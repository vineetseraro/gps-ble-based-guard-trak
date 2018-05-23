import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TourIdFormat'
})
export class TourIdFormatPipe implements PipeTransform {
  transform(val) {
    let formattedTourId = '';
    if ( val.task.name ) {
      formattedTourId += val.task.name;
    }

    if ( val.tourId ) {
      formattedTourId += ' - ' + val.tourId;
    }
    return formattedTourId;
  }
}
