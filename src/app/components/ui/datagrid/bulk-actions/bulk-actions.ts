import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import type { DatagridBulkAction } from '../action';
import { SelectedRows } from '../selected-rows';

@Component({
  selector: 'app-ui-datagrid-bulk-actions',
  imports: [MatSelectModule, MatButtonModule],
  templateUrl: './bulk-actions.html',
  styleUrls: ['./bulk-actions.css'],
})
export class BulkActions {
  selectedRows = input.required<SelectedRows>();
  total = input.required<number>();
  actions = input<DatagridBulkAction[]>([]);

  selection = computed(() => {
    if (this.selectedRows().reverse) {
      return this.total() - this.selectedRows().ids.length;
    }
    return this.selectedRows().ids.length;
  });

  applyAction(action: DatagridBulkAction) {
    if (action) {
      action.handler(this.selectedRows());
    }
  }
}
