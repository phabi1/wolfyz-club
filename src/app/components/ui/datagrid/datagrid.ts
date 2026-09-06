import { Component, computed, input, output } from '@angular/core';
import type { DatagridAction, DatagridBulkAction } from './action';
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
  bulkActions = input<DatagridBulkAction<any>[]>([]);
  fetching = input<boolean>(false);
  paginable = input<boolean>(true);
  currentPage = input<number>(1);
  quickSearch = input<boolean>(false);
  search = input('');

  rowClick = output<{row: any}>();
  paginationChange = output<{page: number, size: number}>();
  searchChange = output<string>();

  hasBulkActions = computed(() => this.bulkActions().length > 0); 

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
