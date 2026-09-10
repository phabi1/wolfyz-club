import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appUiDetailItem]',
})
export class DetailItem {
  readonly label = input<string>('');
  readonly color = input<string>('');
  readonly templateRef = inject(TemplateRef<any>);
}
