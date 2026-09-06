import { Component } from '@angular/core';
import { Cell } from '../../../cell';
import { AmountPipe } from '../../../../../../pipes/amount-pipe';

@Component({
  selector: 'app-ui-datagrid-table-cell-amount',
  imports: [AmountPipe],
  templateUrl: './amount.html',
  styleUrls: ['./amount.css'],
})
export class Amount extends Cell<number> {
}
