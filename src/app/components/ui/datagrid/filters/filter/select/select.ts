import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Base } from '../base';

@Component({
  selector: 'app-ui-datagrid-filters-filter-select',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './select.html',
  styleUrls: ['./select.css'],
})
export class Select extends Base {
  values = input.required<{ value: any; label: string }[]>();

  onChange(value: any) {
    this.valueChange.emit(value);
  }
}