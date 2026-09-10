import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Subscription } from '../../../../../../models/membership/subscription';
import { Badge } from '../../../../../ui/badge/badge';
import { LicenseTypePipe } from "../../../../../../pipes/membership/license-type-pipe";
import { Chip } from '../../../../../ui/chip/chip';
import { Details } from '../../../../../ui/details/details';
import { DetailItem } from '../../../../../ui/details/detail-item';

@Component({
  selector: 'app-membership-subscription-details-overview-section',
  imports: [Badge, Chip, LicenseTypePipe, Details, DetailItem],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewSection {
  item = input.required<Subscription>();
  contactsCount = input.required<number>();
  sessionsCount = input.required<number>();
  readonly notProvidedLabel = $localize`:@@membership.subscriptions.notProvided:Not provided`;

  formatTimestamp(value: Date | string | number | null | undefined): string {
    if (!value) {
      return this.notProvidedLabel;
    }

    const parsed = this.toDate(value);

    if (Number.isNaN(parsed.getTime())) {
      return this.notProvidedLabel;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  }

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value || this.notProvidedLabel;
  }

  private toDate(value: Date | string | number): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
    }

    return new Date(value);
  }
}
