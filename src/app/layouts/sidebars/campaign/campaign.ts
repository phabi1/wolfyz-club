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
import type { Permission } from '../../../models/user/permission';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout-sidebar-membership-campaign',
  imports: [RouterLink, Navbar],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Campaign {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  campaignId = signal<string | null>('2');

  /** Links the user's permissions give access to (the dashboard only needs the section access). */
  links = computed<NavItem[]>(() => {
    const campaignId = this.campaignId();
    this.authService.permissions();
    const links: { item: NavItem; permission?: Permission }[] = [
      {
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.dashboard:Dashboard`,
          to: `/membership/campaign/${campaignId}`,
          exact: true,
        },
      },
      {
        permission: 'membership.subscription.view',
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.members:Members`,
          to: `/membership/campaign/${campaignId}/subscriptions`,
        },
      },
      {
        permission: 'membership.campaign.view',
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.periods:Periods`,
          to: `/membership/campaign/${campaignId}/periods`,
        },
      },
      {
        permission: 'membership.campaign.view',
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.lessons:Lessons`,
          to: `/membership/campaign/${campaignId}/lessons`,
        },
      },
      {
        permission: 'membership.request.view',
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.requests:Requests`,
          to: `/membership/campaign/${campaignId}/requests`,
        },
      },
      {
        permission: 'membership.campaign.view',
        item: {
          type: 'link',
          label: $localize`:@@nav.campaign.settings:Settings`,
          to: `/membership/campaign/${campaignId}/settings`,
        },
      },
    ];
    return links
      .filter((link) => !link.permission || this.authService.hasPermission(link.permission))
      .map((link) => link.item);
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
