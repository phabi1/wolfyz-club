import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../../../components/ui/page/page';
import { membershipSubscriptionList } from '../../../../../stores/membership/subscriptions/list';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Subscription } from '../../../../../models/membership/subscription';

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
}
