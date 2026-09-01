import { Component, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-widget-current-campaign',
  imports: [RouterLink],
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
