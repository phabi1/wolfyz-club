import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '../utils/date';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: string | Date | number, ...args: unknown[]): unknown {
    return formatDate(value);
  }
}
