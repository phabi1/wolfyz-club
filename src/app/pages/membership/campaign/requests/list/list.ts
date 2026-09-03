import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../../../../components/ui/page/page';
import { membershipRequestList } from '../../../../../stores/membership/request/list';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Payment } from '../../../../../models/billing/payment';

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

  rowActions: DatagridAction<Payment>[] = [
    {
      label: 'View',
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
}
