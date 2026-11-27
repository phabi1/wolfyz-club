import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Badge } from '../../../../components/ui/badge/badge';
import { DetailItem } from '../../../../components/ui/details/detail-item';
import { Details as UiDetails } from '../../../../components/ui/details/details';
import type { PageAction } from '../../../../components/ui/page/action';
import { Page } from '../../../../components/ui/page/page';
import { YesNo } from '../../../../components/ui/yes-no/yes-no';
import { DatePipe } from '../../../../pipes/date-pipe';
import { NotProvidedPipe } from '../../../../pipes/not-provided-pipe';
import { AuthService } from '../../../../services/auth.service';
import { ConfirmDialogService } from '../../../../services/ui/confirm-dialog.service';
import { UserService } from '../../../../services/user/user.service';
import { userUserDetails } from '../../../../stores/user/users/details';
import { apiErrorMessage } from '../../../../utils/api-error';

@Component({
  selector: 'app-pages-user-users-details',
  imports: [Page, UiDetails, DetailItem, Badge, YesNo, DatePipe, NotProvidedPipe, RouterOutlet],
  providers: [userUserDetails],
  templateUrl: './details.html',
  styleUrl: './details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  readonly store = inject(userUserDetails);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly authService = inject(AuthService);

  readonly deleteError = signal<string | null>(null);
  readonly noRoleLabel = $localize`:@@user.role.none:No role`;

  /** The API forbids deleting one's own account: the action is not offered. */
  readonly isSelf = computed(() => this.store.item()?.id === this.authService.currentUserId());

  readonly pageActions = computed<PageAction[]>(() => {
    const user = this.store.item();
    if (!user) {
      return [];
    }
    const actions: PageAction[] = [
      {
        label: $localize`:@@common.button.edit:Edit`,
        primary: true,
        handler: () => this.router.navigate(['/users', user.id, 'edit']),
      },
    ];
    if (!this.isSelf()) {
      actions.push({
        label: $localize`:@@common.button.delete:Delete`,
        handler: () => this.onDelete(),
      });
    }
    return actions;
  });

  async onDelete(): Promise<void> {
    const user = this.store.item();
    if (!user) {
      return;
    }
    const confirmed = await firstValueFrom(
      this.confirmDialog.confirm({
        title: $localize`:@@user.users.delete.title:Delete user`,
        message: $localize`:@@user.users.delete.message:Delete the account of ${user.name}:name: (${user.email}:email:)? The user will be signed out of every application. This cannot be undone.`,
        confirmLabel: $localize`:@@common.button.delete:Delete`,
        confirmColor: 'warn',
      }),
    );
    if (!confirmed) {
      return;
    }

    this.deleteError.set(null);
    try {
      await firstValueFrom(this.userService.delete(user.id));
      await this.router.navigate(['/users']);
    } catch (error) {
      this.deleteError.set(apiErrorMessage(error));
    }
  }
}
