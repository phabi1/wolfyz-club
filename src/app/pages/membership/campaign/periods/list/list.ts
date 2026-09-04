import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { Period } from '../../../../../models/membership/period';
import { membershipPeriodList, membershipPeriodListEvents } from '../../../../../stores/membership/periods/list';
import { Page } from '../../../../../components/ui/page/page';
import type { PageAction } from '../../../../../components/ui/page/action';

@Component({
  selector: 'app-pages-membership-campaign-periods-list',
  imports: [Page, Datagrid, RouterOutlet],
  providers: [membershipPeriodList],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List {
  readonly store = inject(membershipPeriodList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);

  actions: PageAction[] = [
    {
      label: 'Ajouter',
      primary: true,
      handler: () => {
        this.onAdd();
      },
    },
  ];

  rowActions: DatagridAction<Period>[] = [
    {
      label: 'View',
      handler: (row: Period) => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'periods',
          row.id,
        ]);
      },
    },
    {
      label: 'Edit',
      handler: (row: Period) => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'periods',
          row.id,
          'edit',
        ]);
      },
    }
  ];

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(membershipPeriodListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(membershipPeriodListEvents.setSearch(search));
  }

  onAdd(): void {
    const campaignId = +(this.route.snapshot.paramMap.get('campaignId') || 0);
    if (!campaignId) {
      return;
    }

    this.router.navigate([
      '/membership/campaign',
      campaignId,
      'periods',
      'new',
    ]);
  }
}
