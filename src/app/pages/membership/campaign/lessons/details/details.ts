import { Component, inject } from '@angular/core';
import { Page } from '../../../../../components/ui/page/page';
import { membershipLessonDetails } from '../../../../../stores/membership/lessons/details';
import { formatDay } from '../../../../../utils/date';

@Component({
  selector: 'app-pages-membership-campaign-lessons-details',
  imports: [Page],
  providers: [membershipLessonDetails],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  readonly store = inject(membershipLessonDetails);

  formatDay(value: number | null | undefined): string {
    if (typeof value !== 'number') {
      return 'Non renseigne';
    }

    return formatDay(value);
  }

  formatTime(value: number | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const timestamp = value < 1_000_000_000_000 ? value * 1000 : value;
    const parsed = new Date(timestamp);

    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignee';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsed);
  }

  participantsLabel(current?: number | null, max?: number | null): string {
    const count = typeof current === 'number' ? current : 0;
    const cap = typeof max === 'number' ? max : null;

    if (cap === null || cap <= 0) {
      return `${count}`;
    }

    return `${count}/${cap}`;
  }
}
