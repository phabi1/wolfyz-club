import { Component, computed, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { Details as RequestDetails } from '../../../../../components/membership/request/details/details';
import { RequestPay } from '../../../../../components/membership/request/details/request-pay/request-pay';
import { StatusHistory } from '../../../../../components/membership/request/details/status-history/status-history';
import { StatusSwitcher } from '../../../../../components/membership/request/details/status-switcher/status-switcher';
import { Page } from '../../../../../components/ui/page/page';
import {
  membershipRequestDetails,
  membershipRequestDetailsEvents,
} from '../../../../../stores/membership/request/details';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pages-membership-campaign-requests-details',
  imports: [Page, RequestDetails, StatusSwitcher, StatusHistory, RequestPay],
  providers: [membershipRequestDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(membershipRequestDetails);
  readonly dispatcher = inject(Dispatcher);

  backLink = computed(() => {
    if (this.route.snapshot.queryParamMap.get('redirect')) {
      return this.route.snapshot.queryParamMap.get('redirect');
    }
    return '/membership/campaign/' + this.route.snapshot.paramMap.get('campaignId') + '/requests/';
  });

  title = computed(() => {
    const item = this.store.item();
    return item ? item.firstname + ' ' + item.lastname : '';
  });

  onDiscountChange(discountAmount: number) {
    this.dispatcher.dispatch(membershipRequestDetailsEvents.setDiscountAmount({ discountAmount }));
  }

  onSendInvoiceEmail() {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (campaignId == null || id == null) {
      return;
    }

    this.dispatcher.dispatch(membershipRequestDetailsEvents.sendInvoiceEmail({ campaignId, id }));
  }
}
