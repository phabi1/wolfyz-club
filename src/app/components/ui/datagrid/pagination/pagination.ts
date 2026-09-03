import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-datagrid-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
})
export class Pagination {
  count = input<number>(0);
  total = input<number>(0);
}
