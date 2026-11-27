import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import type { DatagridAction } from '../../../../components/ui/datagrid/action';
import { Datagrid } from '../../../../components/ui/datagrid/datagrid';
import { provideDatagrid } from '../../../../components/ui/datagrid/provider';
import type { PageAction } from '../../../../components/ui/page/action';
import { Page } from '../../../../components/ui/page/page';
import type { User } from '../../../../models/user/user';
import { userUserList, userUserListEvents } from '../../../../stores/user/users/list';

@Component({
  selector: 'app-pages-user-users-list',
  imports: [Page, Datagrid, RouterOutlet],
  providers: [
    userUserList,
    provideDatagrid({
      'user-role': () =>
        import('../../../../components/user/datagrid/table/cell/user-role/user-role').then(
          (m) => m.UserRole,
        ),
      'yes-no': () =>
        import('../../../../components/ui/datagrid/table/cell/yes-no/yes-no').then(
          (m) => m.YesNoCell,
        ),
    }),
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  readonly store = inject(userUserList);
  private readonly router = inject(Router);
  private readonly dispatcher = inject(Dispatcher);

  readonly pageActions: PageAction[] = [
    {
      label: $localize`:@@common.button.new:New`,
      primary: true,
      handler: () => this.router.navigate(['/users/new'], { queryParamsHandling: 'preserve' }),
    },
  ];

  readonly rowActions: DatagridAction<User>[] = [
    {
      label: $localize`:@@common.button.view:View`,
      handler: (row) => this.open(row),
    },
  ];

  open(row: User): void {
    this.router.navigate(['/users', row.id]);
  }

  onPaginationChange({ page, size }: { page: number; size: number }): void {
    this.dispatcher.dispatch(userUserListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string): void {
    this.dispatcher.dispatch(userUserListEvents.setSearch(search));
  }
}
