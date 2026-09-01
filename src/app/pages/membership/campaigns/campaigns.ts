import { Component, inject, signal, effect } from '@angular/core';
import { CampaignService } from '../../../services/membership/campaign.service';
import { Campaign } from '../../../models/membership/campaign';
import { Page } from "../../../components/ui/page/page";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pages-membership-campaigns',
  imports: [Page, RouterLink],
  templateUrl: './campaigns.html',
  styleUrl: './campaigns.css',
})
export class Campaigns {
  private campaignService: CampaignService = inject(CampaignService); // Replace 'any' with the actual type of your service

  items = signal<Campaign[]>([]);

  constructor() {
    effect(() => {
      this.campaignService.items().subscribe((data) => {
        this.items.set(data.items);
      });
    });
  }
}
