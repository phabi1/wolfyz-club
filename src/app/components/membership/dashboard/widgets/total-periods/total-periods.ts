import { Component, effect, inject, signal } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';
import { PeriodService } from '../../../../../services/membership/period.service';
@Component({
  selector: 'app-membership-dashboard-widget-total-periods',
  imports: [TotalWidget],
  templateUrl: './total-periods.html',
  styleUrls: ['./total-periods.css'],
})
export class TotalPeriods {
  private readonly periodService = inject(PeriodService);

  readonly value = signal(0);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.periodService.items(2).subscribe({
        next: ({ total }) => {
          this.value.set(total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    });
  }
}
