import { Component, input } from '@angular/core';
import { Cell } from '../../../cell';

@Component({
  selector: 'app-ui-datagrid-table-cell-text',
  imports: [],
  templateUrl: './text.html',
  styleUrls: ['./text.css'],
})
export class Text extends Cell {

  featured = input<boolean>(false)
}
