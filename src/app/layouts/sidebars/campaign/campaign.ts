import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { Navbar } from '../../../components/ui/navbar/navbar';
import { NavItem } from '../../../components/ui/navbar/nav-item';

@Component({
  selector: 'app-layout-sidebar-membership-campaign',
  imports: [RouterLink, Navbar],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Campaign {
  private readonly route = inject(ActivatedRoute);

  campaignId = signal<string | null>('2');

  links = computed<NavItem[]>(() => {
    const campaignId = this.campaignId();
    return [
      {
        type: 'link',
        label: $localize`:@@nav.campaign.dashboard:Dashboard`,
        to: `/membership/campaign/${campaignId}`,
        exact: true,
      },
      {
        type: 'link',
        label: $localize`:@@nav.campaign.members:Members`,
        to: `/membership/campaign/${campaignId}/subscriptions`,
      },
      {
        type: 'link',
        label: $localize`:@@nav.campaign.periods:Periods`,
        to: `/membership/campaign/${campaignId}/periods`,
      },
      {
        type: 'link',
        label: $localize`:@@nav.campaign.lessons:Lessons`,
        to: `/membership/campaign/${campaignId}/lessons`,
      },
      {
        type: 'link',
        label: $localize`:@@nav.campaign.requests:Requests`,
        to: `/membership/campaign/${campaignId}/requests`,
      },
      {
        type: 'link',
        label: $localize`:@@nav.campaign.settings:Settings`,
        to: `/membership/campaign/${campaignId}/settings`,
      },
    ];
  });

  constructor() {
    effect(() => {
      const subscription = this.route.params
        .pipe(map((params) => params['campaignId']))
        .subscribe((campaignId) => {
          if (!campaignId) {
            return;
          }
          this.campaignId.set(campaignId);
        });
      return () => subscription.unsubscribe();
    });
  }
}
