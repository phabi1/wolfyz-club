import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bites',
})
export class BitesPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    if (value === null || value === undefined) {
      return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let size = value;
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }
    return `${size.toFixed(2)} ${units[index]}`;
  }
}
