import { Pipe, PipeTransform } from '@angular/core';
import { environment } from './../../../environments/environment';

@Pipe({
  name: 'shipmentstatus'
})
export class ShipmentStatusPipe implements PipeTransform {
  transform(val) {
    for (const i in environment.shipmentStatus) {
      if ( environment.shipmentStatus[i] === val ) {
        return i;
      }
    }
    return '--';
  }
}
