import { Component } from '@angular/core';
import { Cell } from '../../../../../ui/datagrid/cell';
import { Badge } from '../../../../../ui/badge/badge';

@Component({
  selector: 'app-payment-type',
  imports: [Badge],
  templateUrl: './payment-type.html',
  styleUrl: './payment-type.css',
})
export class PaymentType extends Cell<string> {}
