import { Component, computed, input, output, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import type { DatagridAction, DatagridBulkAction } from '../action';
import type { DatagridColumn } from '../column';
import { SelectedRows } from '../selected-rows';
import { CellOutlet } from './cell-outlet/cell-outlet';
import { Actions } from './cell/actions/actions';

@Component({
  selector: 'app-ui-datagrid-table',
  imports: [MatTableModule, MatButtonModule, Actions, CellOutlet, MatCheckboxModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class Table {
  columns = input.required<DatagridColumn[]>();
  rows = input.required<unknown[]>();
  actions = input.required<DatagridAction<any>[]>();
  bulkActions = input.required<DatagridBulkAction[]>();

  rowClick = output<{ row: unknown }>();
  selectedRowsChange = output<SelectedRows>();

  hasBulkActions = computed(() => {
    return this.bulkActions().length > 0;
  });

  hasActions = computed(() => {
    return this.actions().length > 0;
  });

  displayedColumns = computed(() => {
    const columnNames = this.columns().map((column) => column.name);
    if (this.hasBulkActions()) {
      columnNames.unshift('checkbox');
    }
    if (this.hasActions()) {
      columnNames.push('actions');
    }
    return columnNames;
  });

  selectionReverse = signal(false);
  selectedIds = signal<(string | number)[]>([]);

  selectedCount = computed(() => {
    if (this.selectionReverse()) {
      return this.rows().length - this.selectedIds().length;
    }
    return this.selectedIds().length;
  });

  hasSelection = computed(() => {
    return this.selectedCount() > 0;
  });

  onRowClick(event: Event, row: unknown) {
    event.stopPropagation();
    this.rowClick.emit({ row });
  }

  isCurrentPageAllSelected = computed(() => {
    if (this.rows().length === 0) return false;
    return this.rows().every((r) => this.isSelected(r));
  });

  isCurrentPageIndeterminate = computed(() => {
    if (this.rows().length === 0) return false;
    return !this.isCurrentPageAllSelected() && this.rows().some((r) => this.isSelected(r));
  });

  isSelected(row: any) {
    if (this.selectionReverse()) {
      return !this.selectedIds().includes(row.id);
    }
    return this.selectedIds().includes(row.id);
  }

  toggleRow(row: any) {
    if (this.selectionReverse()) {
      this.selectedIds.set([...this.selectedIds(), row.id]);
    } else {
      this.selectedIds.set(this.selectedIds().filter((id) => id !== row.id));
    }
    this.raiseSelectedRows();
  }

  toggleCurrentPage() {
    if (this.isCurrentPageAllSelected()) {
      this.rows().forEach((row: any) => {
        if (this.selectionReverse()) {
          this.selectedIds.set([...this.selectedIds(), row.id]);
        } else {
          this.selectedIds.set(this.selectedIds().filter((id) => id !== row.id));
        }
      });
    } else {
      this.rows().forEach((row: any) => {
        if (this.selectionReverse()) {
          this.selectedIds.set(this.selectedIds().filter((id) => id !== row.id));
        } else {
          this.selectedIds.set([...this.selectedIds(), row.id]);
        }
      });
    }
    this.raiseSelectedRows();
  }

  selectAllRows() {
    this.selectionReverse.set(true);
    this.selectedIds.set([]);
    this.raiseSelectedRows();
  }
  deselectAllRows() {
    this.selectionReverse.set(false);
    this.selectedIds.set([]);
    this.raiseSelectedRows();
  }

  private raiseSelectedRows() {
    const selectedRows: SelectedRows = {
      reverse: this.selectionReverse(),
      ids: this.selectedIds(),
    };
    this.selectedRowsChange.emit(selectedRows);
  }
}
