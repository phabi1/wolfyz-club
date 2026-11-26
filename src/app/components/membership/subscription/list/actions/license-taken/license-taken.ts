import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { finalize } from 'rxjs/operators';
import { SubscriptionService } from '../../../../../../services/membership/subscription.service';
import { fromDateInput, toDateInput } from '../../../../../../utils/date';

export interface LicenseTakenDialogData {
  campaignId: string | null;
  ids: (string | number)[];
  reverse: boolean;
}

@Component({
  selector: 'app-membership-subscription-list-actions-license-taken',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './license-taken.html',
  styleUrls: ['./license-taken.css'],
})
export class LicenseTaken {
  private readonly data = inject<LicenseTakenDialogData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly dialogRef = inject(MatDialogRef<LicenseTaken>);
  private readonly subscriptionService = inject(SubscriptionService);

  readonly selectionCount = this.data?.reverse ? null : (this.data?.ids.length ?? 0);

  taken = true;
  takenAt = toDateInput(new Date());

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  get canSubmit(): boolean {
    return !this.saving() && (!this.taken || !!fromDateInput(this.takenAt));
  }

  submit(): void {
    if (!this.data?.campaignId) {
      this.errorMessage.set($localize`:@@membership.subscriptions.licenseTaken.noCampaign:No campaign selected.`);
      return;
    }
    if (!this.canSubmit) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.dialogRef.disableClose = true;

    this.subscriptionService
      .licenseTaken(
        this.data.campaignId,
        { ids: this.data.ids, reverse: this.data.reverse },
        this.taken ? fromDateInput(this.takenAt) : null,
      )
      .pipe(
        finalize(() => {
          this.saving.set(false);
          this.dialogRef.disableClose = false;
        }),
      )
      .subscribe({
        next: (result) => this.dialogRef.close(result),
        error: () =>
          this.errorMessage.set(
            $localize`:@@membership.subscriptions.licenseTaken.failed:Failed to update the licenses.`,
          ),
      });
  }
}
