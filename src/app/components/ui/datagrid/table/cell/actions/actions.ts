import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import type { DatagridAction } from '../../../action';

@Component({
  selector: 'app-ui-datagrid-table-cell-actions',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './actions.html',
  styleUrls: ['./actions.css'],
})
export class Actions {
  row = input.required<unknown>();
  actions = input<DatagridAction[]>([]);

  onClick(event: Event, action: DatagridAction) {
    action.handler(this.row());
  }
}
