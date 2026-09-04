import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { PageAction } from '../../../../../components/ui/page/action';
import { Page } from '../../../../../components/ui/page/page';
import { membershipLessonDetails } from '../../../../../stores/membership/lessons/details';
import { formatDay } from '../../../../../utils/date';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages-membership-campaign-lessons-details',
  imports: [Page, RouterOutlet],
  providers: [membershipLessonDetails],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  readonly store = inject(membershipLessonDetails);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute)

  readonly pageActions: PageAction[] = [
    {
      label: 'Edit',
      handler: () => {
        this.router.navigate(['edit'], { relativeTo: this.route });
      },
    },
  ];

  formatDay(value: number | null | undefined): string {
    if (typeof value !== 'number') {
      return 'Non renseigne';
    }

    return formatDay(value);
  }

  formatTime(value: number | Date | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    if (value instanceof Date) {
      value = value.getTime();
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
