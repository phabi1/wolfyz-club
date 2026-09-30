import { Component, computed, effect, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import type { DatagridColumn } from '../column';
import type { DatagridAction, DatagridBulkAction } from '../action';
import { Actions } from './cell/actions/actions';
import { CellOutlet } from './cell-outlet/cell-outlet';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-ui-datagrid-table',
  imports: [MatTableModule, Actions, CellOutlet, MatCheckboxModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class Table {
  columns = input.required<DatagridColumn[]>();
  rows = input.required<unknown[]>();
  actions = input.required<DatagridAction<any>[]>();
  bulkActions = input.required<DatagridBulkAction<any>[]>();

  rowClick = output<{ row: unknown }>();
  selectedRowsChange = output<unknown[]>();

  displayedColumns = computed(() => {
    const columnNames = this.columns().map((column) => column.name);
    if (this.bulkActions().length > 0) {
      columnNames.unshift('checkbox');
    }
    if (this.actions().length > 0) {
      columnNames.push('actions');
    }
    return columnNames;
  });

  selection = new SelectionModel<any>(true, []);

  constructor() {
    effect(() => {
      const subscription = this.selection.changed.subscribe(() => {
        this.selectedRowsChange.emit(this.selection.selected);
      });
      return () => subscription.unsubscribe();
    });
  }

  onRowClick(event: Event, row: unknown) {
    event.stopPropagation();
    this.rowClick.emit({ row });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows().length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.rows().forEach((row) => this.selection.select(row));
  }
}
