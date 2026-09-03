import { Component, effect, inject, signal } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';
import { SubscriptionService } from '../../../../../services/membership/subscription.service';

@Component({
  selector: 'app-total-subscriptions',
  imports: [TotalWidget],
  templateUrl: './total-subscriptions.html',
  styleUrls: ['./total-subscriptions.css'],
})
export class TotalSubscriptions {
  private readonly subscriptionService = inject(SubscriptionService);

  readonly value = signal(0);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.subscriptionService.items(2).subscribe({
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
