import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../../../components/ui/page/page';
import {
  membershipSubscriptionList,
  membershipSubscriptionListEvents,
} from '../../../../../stores/membership/subscriptions/list';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Subscription } from '../../../../../models/membership/subscription';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-list',
  imports: [Page, Datagrid],
  providers: [membershipSubscriptionList],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(membershipSubscriptionList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);

  rowActions: DatagridAction<Subscription>[] = [
    {
      label: 'View',
      handler: (row: Subscription) => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'subscriptions',
          row.id,
        ]);
      },
    },
  ];

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(membershipSubscriptionListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(membershipSubscriptionListEvents.setSearch(search));
  }
}
