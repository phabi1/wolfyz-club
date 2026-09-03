import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'number') {
      if (value !== 0) {
        return (value / 100).toFixed(2) + '€';
      }
      return 'Gratuit';
    }
    return '-';
  }
}
