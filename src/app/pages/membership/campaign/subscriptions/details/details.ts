import { Component, computed, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { MemberSection } from '../../../../../components/membership/subscription/details/info/member/member';
import { OverviewSection } from '../../../../../components/membership/subscription/details/info/overview/overview';
import { SessionsSection } from '../../../../../components/membership/subscription/details/info/sessions/sessions';
import { Page } from '../../../../../components/ui/page/page';
import {
  membershipSubscriptionDetails,
  membershipSubscriptionDetailsEvents,
} from '../../../../../stores/membership/subscriptions/details';
import { ContactsSection } from '../../../../../components/membership/subscription/details/info/contacts/contacts';
import type { Session } from '../../../../../models/membership/session';
import type { Subscription } from '../../../../../models/membership/subscription';
import { License } from '../../../../../components/membership/subscription/details/info/license/license';

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-details',
  imports: [Page, OverviewSection, SessionsSection, MemberSection, ContactsSection, License],
  providers: [membershipSubscriptionDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  readonly store = inject(membershipSubscriptionDetails);
  readonly dispatcher = inject(Dispatcher);

  readonly isLicenseUpdating = computed(() => {
    return this.store.updating().includes('license');
  });
  readonly isMemberUpdating = computed(() => {
    return this.store.updating().includes('member');
  });
  readonly isContactsUpdating = computed(() => {
    return this.store.updating().includes('contacts');
  });
  readonly isSessionsUpdating = computed(() => {
    return this.store.updating().includes('sessions');
  });

  onMemberChange(member: any): void {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (!campaignId || !id) {
      return;
    }
    this.dispatcher.dispatch(
      membershipSubscriptionDetailsEvents.update({
        member,
      }),
    );
  }

  onLicenseChange(license: any): void {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (!campaignId || !id) {
      return;
    }
    this.dispatcher.dispatch(
      membershipSubscriptionDetailsEvents.update({
        license,
      }),
    );
  }

  onContactsChange(contacts: Subscription['contacts']): void {
    const campaignId = this.store.campaignId();
    const id = this.store.id();
    if (!campaignId || !id) {
      return;
    }

    this.dispatcher.dispatch(
      membershipSubscriptionDetailsEvents.update({
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
      membershipSubscriptionDetailsEvents.update({
        sessions,
      }),
    );
  }
}
