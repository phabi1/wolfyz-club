import { Component } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';

@Component({
  selector: 'app-total-subscriptions',
  imports: [TotalWidget],
  templateUrl: './total-subscriptions.html',
  styleUrls: ['./total-subscriptions.css'],
})
export class TotalSubscriptions {}
