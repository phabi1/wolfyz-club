import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RequestStatusPipe } from '../../../../../pipes/membership/request-status-pipe';
import { RequestService } from '../../../../../services/membership/request.service';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total/total-widget';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-membership-dashboard-widget-total-request-status',
  imports: [TotalWidget, RequestStatusPipe, RouterLink],
  templateUrl: './total-request-status.html',
  styleUrl: './total-request-status.css',
})
export class TotalRequestStatus {
  private readonly requestService = inject(RequestService);

  readonly campaignId = computed(() => {
    // Replace this with the actual logic to get the campaign ID
    return 2;
  });

  readonly value = signal(0);
  readonly loading = signal(true);

  status = input<string>('pending');

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.requestService.countByStatus(this.campaignId()).subscribe({
        next: (statusCounts) => {
          const status = this.status();
          const total = statusCounts[status] || 0;
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
