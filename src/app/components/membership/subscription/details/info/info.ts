import { Component, input } from '@angular/core';
import type { Subscription } from '../../../../../models/membership/subscription';

@Component({
  selector: 'app-membership-subscription-details-info',
  imports: [],
  templateUrl: './info.html',
  styleUrls: ['./info.css'],
})
export class Info {
  item = input.required<Subscription>();
}
