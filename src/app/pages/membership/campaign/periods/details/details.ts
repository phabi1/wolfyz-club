import { Component, inject } from '@angular/core';
import { Page } from '../../../../../components/ui/page/page';
import { membershipPeriodDetails } from '../../../../../stores/membership/periods/details';

@Component({
  selector: 'app-pages-membership-campaign-periods-details',
  imports: [Page],
  providers: [membershipPeriodDetails],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  readonly store = inject(membershipPeriodDetails);

  formatDate(value: Date | string | number | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const parsed = this.toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignee';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
    }).format(parsed);
  }

  periodDays(start: Date | string | number | null, end: Date | string | number | null): number {
    if (!start || !end) {
      return 0;
    }

    const startDate = this.toDate(start);
    const endDate = this.toDate(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 0;
    }

    const diff = endDate.getTime() - startDate.getTime();
    if (diff < 0) {
      return 0;
    }

    return Math.floor(diff / 86_400_000) + 1;
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
