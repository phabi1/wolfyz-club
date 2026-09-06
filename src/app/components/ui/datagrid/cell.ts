import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appUiDatagridTableCell]',
})
export class Cell<T = unknown> {
  constructor() {}

  value = input<T>();
}
