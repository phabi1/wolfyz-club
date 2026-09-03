import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RequestDetails } from '../../../../models/membership/request-details';
import { Participants } from "./info/participants/participants";

@Component({
  selector: 'app-membership-request-details',
  imports: [Participants],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  item = input.required<RequestDetails>();

  readonly statusLabels: Record<RequestDetails['status'], string> = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Rejetée',
    canceled: 'Annulée',
    paid: 'Payée',
    archived: 'Archivée',
  };

  formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return 'Non renseignée';
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignée';
    }

    return new Intl.DateTimeFormat('fr-FR').format(parsed);
  }

  yesNo(value: boolean): string {
    return value ? 'Oui' : 'Non';
  }
}
