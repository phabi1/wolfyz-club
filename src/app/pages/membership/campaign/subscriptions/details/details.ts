import { Component, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { Info } from "../../../../../components/membership/subscription/details/info/info";
import { Page } from "../../../../../components/ui/page/page";
import { membershipSubscriptionDetails } from '../../../../../stores/membership/subscriptions/details';

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-details',
  imports: [Page,  Info],
  providers: [membershipSubscriptionDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  readonly store = inject(membershipSubscriptionDetails);
  readonly dispatcher = inject(Dispatcher);
}
