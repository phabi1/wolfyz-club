import { Directive, input, output } from '@angular/core';

@Directive({
  selector: '[appUiDatagidFiltersFileBase]',
})
export class Base {
  name = input.required();
  label = input.required();
  value = input<any>();
  valueChange = output<any>();
}
