import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DeviceFormat'
})
export class DeviceFormatPipe implements PipeTransform {
  transform(val) {
    let formattedDevice = '';
    if ( val ) {
      if ( val.name ) {
        formattedDevice += val.name;
      }

      /* if ( val.code ) {
        formattedDevice += ' - ' + val.name;
      } */
    }
    if (formattedDevice === '') {
      formattedDevice = '-';
    }
    return formattedDevice;
  }
}
