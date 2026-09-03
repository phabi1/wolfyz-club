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
    approved: 'approuve',
    rejected: 'rejete',
    canceled: 'annule',
    paid: 'marque comme paye',
  };

  form = new FormGroup({});
  model: { status: StatusChangeAction | ''; reason: string } = { status: '', reason: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'status',
      type: 'select',
      props: {
        label: 'Nouveau statut',
        placeholder: 'Selectionner un statut',
        required: true,
        options: [
          { value: 'approved', label: 'Approuvee' },
          { value: 'rejected', label: 'Rejetee' },
          { value: 'canceled', label: 'Annulee' },
          { value: 'paid', label: 'Payee' },
        ],
      },
    },
    {
      key: 'reason',
      type: 'textarea',
      props: {
        label: 'Raison (optionnelle)',
        placeholder: 'Ajouter un commentaire',
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
        this.snackBar.open('Erreur lors du changement de statut.', 'Fermer', {
          duration: 5000,
        });
      } else {
        const status = this.submittedStatus();
        const label = status ? this.statusLabels[status] : 'mis a jour';
        this.snackBar.open(`Statut ${label} avec succes.`, 'Fermer', {
          duration: 3000,
        });
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
      this.submitError.set('La raison est obligatoire pour un rejet.');
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
      this.submitError.set('Impossible de changer le statut sans demande chargee.');
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
        title: status === 'rejected' ? 'Confirmer le rejet' : 'Confirmer l\'annulation',
        message:
          status === 'rejected'
            ? 'Cette action va rejeter la demande. Voulez-vous continuer ?'
            : 'Cette action va annuler la demande. Voulez-vous continuer ?',
        confirmLabel: 'Confirmer',
        cancelLabel: 'Annuler',
        confirmColor: 'warn',
      }),
    );

    return result === true;
  }
}
