import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Subscription } from '../../../../../../../models/membership/subscription';
import { formatBirthday } from '../../../../../../../utils/date';
import { Badge } from '../../../../../../ui/badge/badge';
import { Address } from '../../../../../../ui/address/address';

@Component({
  selector: 'app-membership-subscription-details-member-section',
  imports: [Badge, Address],
  templateUrl: './member.html',
  styleUrl: './member.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberSection {
  item = input.required<Subscription>();
  readonly notProvidedLabel = $localize`:@@membership.subscriptions.notProvided:Not provided`;
  readonly unknownInitialsLabel = $localize`:@@membership.subscriptions.unknownInitials:??`;

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value || this.notProvidedLabel;
  }

  memberInitials = computed(() => {
    const member = this.item().member;
    const first = member.firstname?.trim().charAt(0) || '';
    const last = member.lastname?.trim().charAt(0) || '';
    const initials = `${first}${last}`.toUpperCase();

    return initials || this.unknownInitialsLabel;
  });

  formatBirthday(value: string | Date | number): string | null {
    return formatBirthday(value);
  }
}
