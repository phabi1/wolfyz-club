import { Component, inject } from '@angular/core';
import { Page } from '../../../../../components/ui/page/page';
import { membershipPeriodDetails } from '../../../../../stores/membership/periods/details';
import type { PageAction } from '../../../../../components/ui/page/action';
import { PeriodService } from '../../../../../services/membership/period.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages-membership-campaign-periods-details',
  imports: [Page, RouterOutlet],
  providers: [membershipPeriodDetails],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  readonly store = inject(membershipPeriodDetails);
  readonly periodSerivce = inject(PeriodService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  pageActions: PageAction[] = [
    {
      label: 'Imprimer',
      primary: true,
      handler: () => {
        this.print();
      },
    },
    {
      label: 'Modifier',
      handler: () => {
        this.router.navigate(['edit'], { relativeTo: this.route });
      },
    },
    
    {
      label: 'Supprimer',
      handler: () => {
        this.router.navigate([this.store.id(), 'delete']);
      },
    },
  ];

  private print(): void {
    const campaignId = 2;
    const periodId = this.store.id();
    if (campaignId && periodId) {
      this.periodSerivce.print(campaignId, periodId).subscribe();
    }
  }

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
