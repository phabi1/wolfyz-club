import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import type { DatagridBulkAction } from '../action';

@Component({
  selector: 'app-ui-datagrid-bulk-actions',
  imports: [MatSelectModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './bulk-actions.html',
  styleUrls: ['./bulk-actions.css'],
})
export class BulkActions {
  selectedRows = input.required<unknown[]>();
  actions = input<DatagridBulkAction<any>[]>([]);
}
