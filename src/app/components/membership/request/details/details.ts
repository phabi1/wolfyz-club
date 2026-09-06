import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RequestDetails } from '../../../../models/membership/request-details';
import { Participants } from "./info/participants/participants";
import { Badge } from '../../../ui/badge/badge';

@Component({
  selector: 'app-membership-request-details',
  imports: [Participants, Badge],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  item = input.required<RequestDetails>();
  readonly notProvidedLabel = $localize`:@@membership.requests.notProvided:Not provided`;

  readonly statusLabels: Record<RequestDetails['status'], string> = {
    pending: $localize`:@@membership.requests.status.pending:Pending`,
    approved: $localize`:@@membership.requests.status.approved:Approved`,
    rejected: $localize`:@@membership.requests.status.rejected:Rejected`,
    canceled: $localize`:@@membership.requests.status.canceled:Canceled`,
    paid: $localize`:@@membership.requests.status.paid:Paid`,
    archived: $localize`:@@membership.requests.status.archived:Archived`,
  };

  formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return this.notProvidedLabel;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return this.notProvidedLabel;
    }

    return new Intl.DateTimeFormat('fr-FR').format(parsed);
  }

  yesNo(value: boolean): string {
    return value
      ? $localize`:@@membership.requests.yes:Yes`
      : $localize`:@@membership.requests.no:No`;
  }
}
