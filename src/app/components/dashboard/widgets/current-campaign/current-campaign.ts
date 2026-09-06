import { Component, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../../ui/dashboard/widgets/card/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-widget-current-campaign',
  imports: [RouterLink, Card, MatButtonModule],
  templateUrl: './current-campaign.html',
  styleUrls: ['./current-campaign.css'],
})
export class CurrentCampaign {
campaignId = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.campaignId.set(localStorage.getItem('campaignId'));
    });
  }
}
