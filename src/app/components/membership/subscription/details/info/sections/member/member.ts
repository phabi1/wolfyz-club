import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Subscription } from '../../../../../../../models/membership/subscription';

@Component({
  selector: 'app-membership-subscription-details-member-section',
  imports: [],
  templateUrl: './member.html',
  styleUrl: './member.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberSection {
  item = input.required<Subscription>();

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value || 'Non renseigne';
  }

  memberInitials(): string {
    const member = this.item().member;
    const first = member.firstname?.trim().charAt(0) || '';
    const last = member.lastname?.trim().charAt(0) || '';
    const initials = `${first}${last}`.toUpperCase();

    return initials || '??';
  }

  formatBirthdate(value: string | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignee';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'long',
    }).format(parsed);
  }
}
