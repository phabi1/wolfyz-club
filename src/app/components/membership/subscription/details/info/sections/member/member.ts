import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Subscription } from '../../../../../../../models/membership/subscription';
import { formatBirthday } from '../../../../../../../utils/date';
import { Badge } from '../../../../../../ui/badge/badge';
import { Address } from '../../../../../../ui/address/address';
import { FilePreview } from '../../../../../../ui/file-preview/file-preview';
import { YesNo } from "../../../../../../ui/yes-no/yes-no";

@Component({
  selector: 'app-membership-subscription-details-member-section',
  imports: [Badge, Address, FilePreview, YesNo],
  templateUrl: './member.html',
  styleUrl: './member.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberSection {
  item = input.required<Subscription>();
  readonly notProvidedLabel = $localize`:@@membership.subscriptions.notProvided:Not provided`;
  readonly unknownInitialsLabel = $localize`:@@membership.subscriptions.unknownInitials:??`;

  fields = [
    {
      name: 'medical_certificate',
      label: $localize`:@@membership.subscriptions.medicalCertificate:Medical certificate`,
      type: 'file',
    },
    {
      name: 'agree_exit',
      label: $localize`:@@membership.subscriptions.agreeExit:Agree exit`,
      type: 'bool',
    },
    {
      name: 'agree_image',
      label: $localize`:@@membership.subscriptions.agreeImage:Agree image`,
      type: 'bool',
    },
  ];

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
