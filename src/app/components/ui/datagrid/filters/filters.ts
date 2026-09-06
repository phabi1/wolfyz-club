import { Component, computed, input, output, signal } from '@angular/core';
import { DatagridColumn } from '../column';

@Component({
  selector: 'app-ui-datagrid-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  columns = input<DatagridColumn[]>([]);
  quickSearch = input<boolean>(false);
  search = input('');
  searchChange = output<string>();

  hasAdvancedFilters = computed(() => this.columns().some((column) => !!column.filterable));

  onValueChange(value: string) {
    this.searchChange.emit(value);
  }
}
