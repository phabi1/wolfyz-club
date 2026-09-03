import { Component, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { MemberSection } from "../../../../../components/membership/subscription/details/info/sections/member/member";
import { OverviewSection } from '../../../../../components/membership/subscription/details/info/sections/overview/overview';
import { SessionsSection } from '../../../../../components/membership/subscription/details/info/sections/sessions/sessions';
import { Page } from '../../../../../components/ui/page/page';
import {
  membershipSubscriptionDetails,
  membershipSubscriptionDetailsEvents,
} from '../../../../../stores/membership/subscriptions/details';
import { ContactsSection } from "../../../../../components/membership/subscription/details/info/sections/contacts/contacts";
import type { Session } from '../../../../../models/membership/session';
import type { Subscription } from '../../../../../models/membership/subscription';

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-details',
  imports: [Page, OverviewSection, SessionsSection, MemberSection, ContactsSection],
  providers: [membershipSubscriptionDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  readonly store = inject(membershipSubscriptionDetails);
  readonly dispatcher = inject(Dispatcher);

  onContactsChange(contacts: Subscription['contacts']): void {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (!campaignId || !id) {
      return;
    }

    this.dispatcher.dispatch(
      membershipSubscriptionDetailsEvents.updateContacts({
        campaignId,
        id,
        contacts,
      }),
    );
  }

  onSessionsChange(sessions: Pick<Session, 'id' | 'lesson_id' | 'subscription_id'>[]): void {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (!campaignId || !id) {
      return;
    }

    this.dispatcher.dispatch(
      membershipSubscriptionDetailsEvents.updateSessions({
        campaignId,
        id,
        sessions,
      }),
    );
  }
}
