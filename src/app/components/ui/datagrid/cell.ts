import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appCell]',
})
export class Cell {
  constructor() {}

  value = input();
}
