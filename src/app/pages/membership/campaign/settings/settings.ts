import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { FormlyModule } from '@ngx-formly/core';
import type { PageAction } from '../../../../components/ui/page/action';
import { Page } from '../../../../components/ui/page/page';
import {
  membershipCampaignSettings,
  membershipCampaignSettingsEvents,
} from '../../../../stores/membership/campaign/settings';

@Component({
  selector: 'app-pages-membership-campaign-settings',
  imports: [Page, FormlyModule, ReactiveFormsModule],
  providers: [membershipCampaignSettings],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly route = inject(ActivatedRoute);
  private readonly dispatcher = inject(Dispatcher);

  readonly store = inject(membershipCampaignSettings);
  readonly actions = computed<PageAction[]>(() => [
    {
      label: this.store.saving() ? 'Saving...' : 'Save settings',
      primary: true,
      handler: () => this.onSubmit(),
    },
  ]);

  form = new FormGroup({});

  constructor() {
    const campaignId = this.route.snapshot.paramMap.get('campaignId');
    if (!campaignId) {
      this.dispatcher.dispatch(
        membershipCampaignSettingsEvents.setValidationError({
          errorMessage: 'Missing campaign id in route.',
        }),
      );
      return;
    }

    this.dispatcher.dispatch(membershipCampaignSettingsEvents.load({ campaignId }));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dispatcher.dispatch(membershipCampaignSettingsEvents.save());
  }

  formatDate(value: unknown): string {
    if (!value) {
      return 'Not set';
    }

    const date = value instanceof Date ? value : new Date(value as string | number);
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('fr-FR');
  }
}
