import { Component, computed, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import type { DatagridColumn } from '../column';
import type { DatagridAction } from '../action';
import { Actions } from "./cell/actions/actions";
import { CellOutlet } from './cell-outlet/cell-outlet';

@Component({
  selector: 'app-ui-datagrid-table',
  imports: [MatTableModule, Actions, CellOutlet],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class Table {
  columns = input.required<DatagridColumn[]>();
  rows = input.required<unknown[]>();
  actions = input.required<DatagridAction<any>[]>();

  rowClick = output<{ row: unknown }>();

  displayedColumns = computed(() => {
    const columnNames = this.columns().map((column) => column.name);
    if (this.actions().length > 0) {
      columnNames.push('actions');
    }
    return columnNames;
  });

  onRowClick(event: Event, row: unknown) {
    event.stopPropagation();
    this.rowClick.emit({ row });
  }
}
