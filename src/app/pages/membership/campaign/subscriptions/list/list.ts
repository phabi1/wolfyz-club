import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import { PageAction } from '../../../../../components/ui/page/action';
import { Page } from '../../../../../components/ui/page/page';
import { Subscription } from '../../../../../models/membership/subscription';
import {
  membershipSubscriptionList,
  membershipSubscriptionListEvents,
} from '../../../../../stores/membership/subscriptions/list';
import { provideDatagrid } from '../../../../../components/ui/datagrid/provider';

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-list',
  imports: [Page, Datagrid],
  providers: [membershipSubscriptionList, provideDatagrid({
    'avatar': () => import('../../../../../components/membership/subscription/list/columns/avatar/avatar').then(m => m.Avatar),
    'license-type': () => import('../../../../../components/membership/subscription/list/columns/license-type/license-type').then(m => m.LicenseType)
  })],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(membershipSubscriptionList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);

  pageActions: PageAction[] = [
    {
      label: $localize`:@@common.button.new:New`,
      primary: true,
      handler: () => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'subscriptions',
          'new',
        ]);
      },
    }
  ];

  rowActions: DatagridAction<Subscription>[] = [
    {
      label: $localize`:@@common.button.view:View`,
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

  onRowClick(row: Subscription) {
    this.router.navigate([
      '/membership/campaign',
      this.route.snapshot.paramMap.get('campaignId'),
      'subscriptions',
      row.id,
    ]);
  }

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(membershipSubscriptionListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(membershipSubscriptionListEvents.setSearch(search));
  }
}
