import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Dispatcher } from '@ngrx/signals/events';
import { membershipRequestDetails, membershipRequestDetailsEvents } from '../../../../../stores/membership/request/details';
import { ConfirmDialogService } from '../../../../../services/ui/confirm-dialog.service';
import { firstValueFrom } from 'rxjs';

type StatusChangeAction = 'approved' | 'rejected' | 'canceled' | 'paid';

@Component({
  selector: 'app-membership-request-details-status-switcher',
  imports: [FormlyModule, MatButtonModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './status-switcher.html',
  styleUrls: ['./status-switcher.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusSwitcher {
  private readonly dispatcher = inject(Dispatcher);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly snackBar = inject(MatSnackBar);

  readonly store = inject(membershipRequestDetails);
  readonly submitError = signal<string | null>(null);
  readonly submitInProgress = signal(false);
  private readonly loadingStarted = signal(false);
  private readonly submittedStatus = signal<StatusChangeAction | null>(null);

  private readonly statusLabels: Record<StatusChangeAction, string> = {
    approved: $localize`:@@membership.requests.statusSwitcher.labelApproved:approved`,
    rejected: $localize`:@@membership.requests.statusSwitcher.labelRejected:rejected`,
    canceled: $localize`:@@membership.requests.statusSwitcher.labelCanceled:canceled`,
    paid: $localize`:@@membership.requests.statusSwitcher.labelPaid:marked as paid`,
  };

  form = new FormGroup({});
  model: { status: StatusChangeAction | ''; reason: string } = { status: '', reason: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'status',
      type: 'select',
      props: {
        label: $localize`:@@membership.requests.statusSwitcher.newStatus:New status`,
        placeholder: $localize`:@@membership.requests.statusSwitcher.statusPlaceholder:Select a status`,
        required: true,
        options: [
          {
            value: 'approved',
            label: $localize`:@@membership.requests.status.approved:Approved`,
          },
          {
            value: 'rejected',
            label: $localize`:@@membership.requests.status.rejected:Rejected`,
          },
          {
            value: 'canceled',
            label: $localize`:@@membership.requests.status.canceled:Canceled`,
          },
          { value: 'paid', label: $localize`:@@membership.requests.status.paid:Paid` },
        ],
      },
    },
    {
      key: 'reason',
      type: 'textarea',
      props: {
        label: $localize`:@@membership.requests.statusSwitcher.reason:Reason (optional)`,
        placeholder: $localize`:@@membership.requests.statusSwitcher.reasonPlaceholder:Add a comment`,
        rows: 3,
      },
    },
  ];

  constructor() {
    effect(() => {
      if (!this.submitInProgress()) {
        return;
      }

      const loading = this.store.loading();
      if (loading) {
        this.loadingStarted.set(true);
        return;
      }

      if (!this.loadingStarted()) {
        return;
      }

      const error = this.store.error();
      if (error) {
        this.snackBar.open(
          $localize`:@@membership.requests.statusSwitcher.changeError:Error while changing status.`,
          $localize`:@@common.button.close:Close`,
          {
          duration: 5000,
          },
        );
      } else {
        const status = this.submittedStatus();
        const label = status
          ? this.statusLabels[status]
          : $localize`:@@membership.requests.statusSwitcher.updated:updated`;
        this.snackBar.open(
          `${$localize`:@@membership.requests.statusSwitcher.changeSuccess:Status`} ${label} ${$localize`:@@membership.requests.statusSwitcher.successSuffix:successfully.`}`,
          $localize`:@@common.button.close:Close`,
          {
          duration: 3000,
          },
        );
        this.form.reset();
        this.model.status = '';
        this.model.reason = '';
      }

      this.submitInProgress.set(false);
      this.loadingStarted.set(false);
      this.submittedStatus.set(null);
    });
  }

  async onApply(): Promise<void> {
    this.submitError.set(null);
    if (!this.model.status) {
      this.form.markAllAsTouched();
      return;
    }

    const reason = (this.model.reason || '').trim();
    if (this.model.status === 'rejected' && !reason) {
      this.submitError.set(
        $localize`:@@membership.requests.statusSwitcher.reasonRequired:Reason is required for a rejection.`,
      );
      return;
    }

    if (this.model.status === 'rejected' || this.model.status === 'canceled') {
      const confirmed = await this.confirmSensitiveAction(this.model.status);
      if (!confirmed) {
        return;
      }
    }

    const item = this.store.item();
    if (!item) {
      this.submitError.set(
        $localize`:@@membership.requests.statusSwitcher.noRequestLoaded:Unable to change status without a loaded request.`,
      );
      return;
    }

    this.submitInProgress.set(true);
    this.submittedStatus.set(this.model.status);

    this.dispatcher.dispatch(
      membershipRequestDetailsEvents.changeStatus({
        campaignId: item.campaign_id,
        id: +item.id,
        status: this.model.status,
        reason,
      }),
    );
  }

  private async confirmSensitiveAction(status: Extract<StatusChangeAction, 'rejected' | 'canceled'>): Promise<boolean> {
    const result = await firstValueFrom(
      this.confirmDialogService.confirm({
        title:
          status === 'rejected'
            ? $localize`:@@membership.requests.statusSwitcher.confirmRejectTitle:Confirm rejection`
            : $localize`:@@membership.requests.statusSwitcher.confirmCancelTitle:Confirm cancellation`,
        message:
          status === 'rejected'
            ? $localize`:@@membership.requests.statusSwitcher.confirmRejectMessage:This action will reject the request. Do you want to continue?`
            : $localize`:@@membership.requests.statusSwitcher.confirmCancelMessage:This action will cancel the request. Do you want to continue?`,
        confirmLabel: $localize`:@@common.button.confirm:Confirm`,
        cancelLabel: $localize`:@@common.button.cancel:Cancel`,
        confirmColor: 'warn',
      }),
    );

    return result === true;
  }
}
