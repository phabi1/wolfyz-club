import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date',
})
export class DatePipe implements PipeTransform {
  transform(value: unknown, format?: string): unknown {
    if (value instanceof Date === false) return null;
    
    if(format === 'date') {
      return value.toDateString();
    } else if (format === 'time') {
      return value.toTimeString();
    } else if (format === 'iso') {
      return value.toISOString();
    }
    
    return value.toDateString() + ' ' + value.toTimeString();
  }
}
