import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { firstValueFrom } from 'rxjs';
import { Badge } from '../../../../components/ui/badge/badge';
import type { PageAction } from '../../../../components/ui/page/action';
import { Page } from '../../../../components/ui/page/page';
import { permissionLabel } from '../../../../models/user/permission';
import type { Role } from '../../../../models/user/role';
import { AuthService } from '../../../../services/auth.service';
import { ConfirmDialogService } from '../../../../services/ui/confirm-dialog.service';
import { RoleService } from '../../../../services/user/role.service';
import { userRoleList, userRoleListEvents } from '../../../../stores/user/roles/list';
import { apiErrorMessage } from '../../../../utils/api-error';

@Component({
  selector: 'app-pages-user-roles-list',
  imports: [Page, Badge, MatButtonModule, RouterOutlet],
  providers: [userRoleList],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  readonly store = inject(userRoleList);
  private readonly router = inject(Router);
  private readonly dispatcher = inject(Dispatcher);
  private readonly roleService = inject(RoleService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly authService = inject(AuthService);

  readonly actionError = signal<string | null>(null);
  readonly permissionLabel = permissionLabel;
  readonly permissionsAria = $localize`:@@user.roles.permissions:Permissions`;
  readonly usersLabel = {
    singular: $localize`:@@user.roles.userSingular:user`,
    plural: $localize`:@@user.roles.userPlural:users`,
  };

  readonly pageActions: PageAction[] = [
    {
      label: $localize`:@@common.button.new:New`,
      primary: true,
      handler: () => this.router.navigate(['/roles/new']),
    },
  ];

  /**
   * The API refuses to modify system roles and roles granting permissions
   * that the signed-in user does not have: the actions are not offered.
   */
  canEdit(role: Role): boolean {
    return !role.is_system && role.permissions.every((p) => this.authService.hasPermission(p));
  }

  onEdit(role: Role): void {
    this.router.navigate(['/roles', role.id, 'edit']);
  }

  async onDelete(role: Role): Promise<void> {
    const message =
      role.user_count > 0
        ? $localize`:@@user.roles.delete.messageUsers:Delete the role ${role.label}:label:? ${role.user_count}:count: user(s) will lose it.`
        : $localize`:@@user.roles.delete.message:Delete the role ${role.label}:label:?`;
    const confirmed = await firstValueFrom(
      this.confirmDialog.confirm({
        title: $localize`:@@user.roles.delete.title:Delete role`,
        message,
        confirmLabel: $localize`:@@common.button.delete:Delete`,
        confirmColor: 'warn',
      }),
    );
    if (!confirmed) {
      return;
    }
    this.actionError.set(null);
    try {
      await firstValueFrom(this.roleService.delete(role.id));
      this.dispatcher.dispatch(userRoleListEvents.load());
    } catch (error) {
      this.actionError.set(apiErrorMessage(error));
    }
  }
}
