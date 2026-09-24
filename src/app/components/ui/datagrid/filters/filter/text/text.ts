import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Base } from '../base';

@Component({
  selector: 'app-ui-datagrid-filters-filter-text',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './text.html',
  styleUrls: ['./text.css'],
})
export class Text extends Base {
  onChange(value: string) {
    this.valueChange.emit(value);
  }
}
