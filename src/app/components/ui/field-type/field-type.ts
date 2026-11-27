import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ui-field-type',
  imports: [],
  templateUrl: './field-type.html',
  styleUrls: ['./field-type.css'],
})
export class FieldType {
  type = input.required<string>();

  color = computed(() => {
    switch (this.type()) {
      case 'text':
        return 'blue';
      case 'number':
        return 'green';
      case 'date':
        return 'red';
      default:
        return 'black';
    }
  });
}
