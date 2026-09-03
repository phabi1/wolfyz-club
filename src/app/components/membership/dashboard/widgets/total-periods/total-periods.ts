import { Component } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';

@Component({
  selector: 'app-total-periods',
  imports: [TotalWidget],
  templateUrl: './total-periods.html',
  styleUrls: ['./total-periods.css'],
})
export class TotalPeriods {}
