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
  rowActions = input<DatagridAction<any>[]>([]);

  rowClick = output<{row: any}>();

  onRowClick(event: {row: any}) {
    this.rowClick.emit({row: event.row});
  }
}
