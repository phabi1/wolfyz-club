import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { BillingService } from '../../../../services/billing/billing.service';
import { Card } from '../../../ui/dashboard/widgets/card/card';
import { GhostingRectangle } from '../../../ui/ghosting/rectangle/rectangle';
import { AmountPipe } from '../../../../pipes/amount-pipe';

@Component({
  selector: 'app-dashboard-widget-bank-amount',
  imports: [GhostingRectangle, Card, MatButtonModule, RouterLink, AmountPipe],
  templateUrl: './bank-amount.html',
  styleUrls: ['./bank-amount.css'],
})
export class BankAmount {
  private billingService: BillingService = inject(BillingService);
  loading = signal(true);
  amount = signal(0);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.billingService.bankAmount().subscribe((amount) => {
        this.amount.set(amount);
        this.loading.set(false);
      });
    });
  }
}
