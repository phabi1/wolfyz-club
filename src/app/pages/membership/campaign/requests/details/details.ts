import { Component, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { Details as RequestDetails } from '../../../../../components/membership/request/details/details';
import { RequestPay } from '../../../../../components/membership/request/details/request-pay/request-pay';
import { StatusHistory } from "../../../../../components/membership/request/details/status-history/status-history";
import { StatusSwitcher } from "../../../../../components/membership/request/details/status-switcher/status-switcher";
import { Page } from "../../../../../components/ui/page/page";
import { membershipRequestDetails, membershipRequestDetailsEvents } from '../../../../../stores/membership/request/details';

@Component({
  selector: 'app-pages-membership-campaign-requests-details',
  imports: [Page, RequestDetails, StatusSwitcher, StatusHistory, RequestPay],
  providers: [membershipRequestDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  readonly store = inject(membershipRequestDetails);
  readonly dispatcher = inject(Dispatcher);

  onDiscountChange(discountAmount: number) {
    this.dispatcher.dispatch(membershipRequestDetailsEvents.setDiscountAmount({ discountAmount }));
  }
}
