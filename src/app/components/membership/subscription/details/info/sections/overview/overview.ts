import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Subscription } from '../../../../../../../models/membership/subscription';

@Component({
  selector: 'app-membership-subscription-details-overview-section',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewSection {
  item = input.required<Subscription>();
  contactsCount = input.required<number>();
  sessionsCount = input.required<number>();

  formatTimestamp(value: number | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const timestamp = value < 1_000_000_000_000 ? value * 1000 : value;
    const parsed = new Date(timestamp);

    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignee';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  }

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value || 'Non renseigne';
  }
}
