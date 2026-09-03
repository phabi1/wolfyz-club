import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-ui-datagrid-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  search = input('');

  searchChange = output<string>();

  onValueChange(value: string) {
    this.searchChange.emit(value);
  }
}
