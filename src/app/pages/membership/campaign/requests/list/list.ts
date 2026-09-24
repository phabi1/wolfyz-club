import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../../../components/ui/page/page';
import { membershipRequestList, membershipRequestListEvents } from '../../../../../stores/membership/request/list';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Payment } from '../../../../../models/billing/payment';
import { Dispatcher } from '@ngrx/signals/events';


@Component({
  selector: 'app-pages-membership-campaign-requests-list',
  imports: [Page, Datagrid],
  providers: [membershipRequestList],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(membershipRequestList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);

  rowActions: DatagridAction<Payment>[] = [
    {
      label: $localize`:@@membership.requests.view:View`,
      handler: (row: Payment) => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'requests',
          row.id,
        ]);
      },
    },
  ];

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(membershipRequestListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(membershipRequestListEvents.setSearch(search));
  }
}
