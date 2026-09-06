import { Component, effect, signal } from '@angular/core';
import { GhostingRectangle } from '../../../ui/ghosting/rectangle/rectangle';
import { Card } from '../../../ui/dashboard/widgets/card/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-widget-bank-amount',
  imports: [GhostingRectangle, Card, MatButtonModule, RouterLink],
  templateUrl: './bank-amount.html',
  styleUrls: ['./bank-amount.css'],
})
export class BankAmount {
  loading = signal(true);
  amount = signal(0);

  constructor() {
    effect(() => {
      
    });
  }
}
