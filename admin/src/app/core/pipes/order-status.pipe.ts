import { Pipe, PipeTransform } from '@angular/core';
import { environment } from './../../../environments/environment';

@Pipe({
  name: 'orderstatus'
})
export class OrderStatusPipe implements PipeTransform {
  transform(val) {
    for (const i in environment.orderStatus) {
      if ( environment.orderStatus[i] === val ) {
        return i;
      }
    }
    return '--';
  }
}
