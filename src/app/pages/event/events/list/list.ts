import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { Datagrid } from '../../../../components/ui/datagrid/datagrid';
import { Page } from '../../../../components/ui/page/page';
import { PageAction } from '../../../../components/ui/page/action';
import { DatagridAction } from '../../../../components/ui/datagrid/action';
import { eventEventList, eventEventListEvents } from '../../../../stores/event/events/list';
import type { Event } from '../../../../models/event/event';

@Component({
  selector: 'app-pages-event-events-list',
  imports: [Page, Datagrid],
  providers: [eventEventList],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(eventEventList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);

  pageActions: PageAction[] = [
    {
      label: $localize`:@@common.button.new:New`,
      primary: true,
      handler: () => {
        this.router.navigate([
          '/event/events/new',
        ]);
      },
    }
  ];

  rowActions: DatagridAction<Event>[] = [
    {
      label: $localize`:@@common.button.view:View`,
      handler: (row: Event) => {
        this.router.navigate([
          '/event/events',
          row.id,
        ]);
      },
    },
  ];

  onRowClick(row: Event) {
    this.router.navigate([
      '/event/events',
      row.id,
    ]);
  }

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(eventEventListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(eventEventListEvents.setSearch(search));
  }
}
