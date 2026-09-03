import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-layout-sidebar-membership-campaign',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './campaign.html',
  styleUrl: './campaign.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Campaign {
  private readonly route = inject(ActivatedRoute);

  campaignId = signal<string | null>('2');

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
