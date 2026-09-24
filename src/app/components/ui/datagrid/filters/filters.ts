import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DatagridColumn } from '../column';
import { Text } from './filter/text/text';
import { Select } from './filter/select/select';
import { DateFilter } from './filter/date/date';
import { NumberFilter } from './filter/number/number';

type FilterRow = {
  row?: number;
};

type TextFilter = {
  type: 'text';
  options: {};
} & FilterRow;

type SelectFilter = {
  type: 'select';
  options: { values: { label: string; value: any }[] };
} & FilterRow;

type DateFilterConfig = {
  type: 'date';
  options: {};
} & FilterRow;

type NumberFilterConfig = {
  type: 'number';
  options: {};
} & FilterRow;

type Filter = TextFilter | SelectFilter | DateFilterConfig | NumberFilterConfig;

type AdvancedFilterItem = {
  name: string;
  label: string;
  type: string;
  options: Record<string, any>;
  row: number;
};

@Component({
  selector: 'app-ui-datagrid-filters',
  imports: [Text, Select, DateFilter, NumberFilter, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  columns = input<DatagridColumn[]>([]);
  quickSearch = input<boolean>(false);
  search = input('');
  searchChange = output<string>();
  filters = input<{ [key: string]: any }>({});
  filtersChange = output<{ [key: string]: any }>();
  showAdvancedFilters = signal(false);

  advancedFilters = computed<AdvancedFilterItem[]>(() =>
    this.columns()
      .filter((column) => !!column.filterable)
      .map((column) => {
        let type = this.determineFilterType(column);
        let options: Record<string, any> = {};
        let row = 1;
        if (column.filterable !== true) {
          const filter = column.filterable as Filter;
          type = filter.type;
          options = filter.options || {};
          row = this.normalizeFilterRow(filter.row);
        }
        return {
          name: column.name,
          label: column.header,
          type,
          options,
          row,
        };
      }),
  );

  advancedFilterRows = computed(() => {
    const grouped = new Map<number, AdvancedFilterItem[]>();

    this.advancedFilters().forEach((filter) => {
      const rowFilters = grouped.get(filter.row) || [];
      rowFilters.push(filter);
      grouped.set(filter.row, rowFilters);
    });

    return Array.from(grouped.entries())
      .sort(([left], [right]) => left - right)
      .map(([row, filters]) => ({ row, filters }));
  });

  hasAdvancedFilters = computed(() => this.advancedFilterRows().length > 0);

  onValueChange(value: string) {
    this.searchChange.emit(value);
  }

  onFilterChange(name: string, value: any) {
    value = value === null || value === undefined ? '' : value;
    const newFilters = { ...this.filters(), [name]: value };
    this.filtersChange.emit(newFilters);
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters.update((opened) => !opened);
  }

  private determineFilterType(column: DatagridColumn): string {
    if (column.filterable === true) {
      return 'text';
    }
    const filter = column.filterable as Filter;
    return filter.type;
  }

  private normalizeFilterRow(row: number | undefined): number {
    if (typeof row !== 'number' || !Number.isFinite(row)) {
      return 1;
    }

    return Math.max(1, Math.floor(row));
  }
}
