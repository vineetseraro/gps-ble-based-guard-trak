import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';

// @Pipe({name: 'exponentialStrength'})
// export class ExponentialStrengthPipe implements PipeTransform {
//   transform(value: number, exponent: string): number {
//     let exp = parseFloat(exponent);
//     return Math.pow(value, isNaN(exp) ? 1 : exp);
//   }
// }

@Pipe({
  name: 'prettyprint'
})
export class PrettyPrintPipe implements PipeTransform {
  transform(val) {
    return JSON.stringify(val, null, 2)
      .replace(' ', '&nbsp;')
      .replace('\n', '<br/>');
  }
}
@NgModule({
  declarations: [PrettyPrintPipe],
  exports: [PrettyPrintPipe]
})

export class PrettyPrintPipeModule { }