import { Component, effect, inject, signal } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total/total-widget';
import { RequestService } from '../../../../../services/membership/request.service';

@Component({
  selector: 'app-membership-dashboard-widget-total-requests',
  imports: [TotalWidget],
  templateUrl: './total-requests.html',
  styleUrls: ['./total-requests.css'],
})
export class TotalRequests {
  private readonly requestService = inject(RequestService);

  readonly value = signal(0);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.requestService.items(2).subscribe({
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
