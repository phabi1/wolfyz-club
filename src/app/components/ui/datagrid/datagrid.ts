import { Component, input, output } from '@angular/core';
import type { DatagridAction } from './action';
import { BulkActions } from './bulk-actions/bulk-actions';
import type { DatagridColumn } from './column';
import { Filters } from './filters/filters';
import { Pagination } from './pagination/pagination';
import { Table } from './table/table';

@Component({
  selector: 'app-ui-datagrid',
  imports: [Table, Pagination, Filters, BulkActions],
  templateUrl: './datagrid.html',
  styleUrls: ['./datagrid.css'],
})
export class Datagrid {
  columns = input.required<DatagridColumn[]>();
  rows = input.required<unknown[]>();
  total = input.required<number>();
  rowActions = input<DatagridAction<any>[]>([]);
  currentPage = input<number>(1);
  search = input('');

  rowClick = output<{row: any}>();
  paginationChange = output<{page: number, size: number}>();
  searchChange = output<string>();

  onRowClick(event: {row: any}) {
    this.rowClick.emit({row: event.row});
  }

  onSearchChange(event: string) {
    this.searchChange.emit(event);
  }
  
  onPaginationChange(event: {page: number, size: number}) {
    this.paginationChange.emit({page: event.page, size: event.size});
  }
}
