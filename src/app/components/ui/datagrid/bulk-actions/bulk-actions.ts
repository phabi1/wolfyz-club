import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-datagrid-bulk-actions',
  imports: [],
  templateUrl: './bulk-actions.html',
  styleUrls: ['./bulk-actions.css'],
})
export class BulkActions {
  count = input<number>(0);
  total = input<number>(0);
}
