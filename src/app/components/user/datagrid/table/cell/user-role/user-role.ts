import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Badge } from '../../../../../ui/badge/badge';
import { Cell } from '../../../../../ui/datagrid/cell';
import type { RoleRef } from '../../../../../../models/user/role';

/** Roles of a user, as badges. */
@Component({
  selector: 'app-user-datagrid-cell-user-role',
  imports: [Badge],
  templateUrl: './user-role.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRole extends Cell<RoleRef[]> {
  readonly roles = computed(() => this.value() ?? []);
  readonly noRoleLabel = $localize`:@@user.role.none:No role`;
}
