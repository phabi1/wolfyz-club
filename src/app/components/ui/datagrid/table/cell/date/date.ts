import { Component } from '@angular/core';
import { Cell } from '../../../cell';
import { DatePipe } from '../../../../../../pipes/date-pipe';

@Component({
  selector: 'app-ui-datagrid-table-cell-date',
  imports: [DatePipe],
  templateUrl: './date.html',
  styleUrl: './date.css',
})
export class DateCell extends Cell {}
