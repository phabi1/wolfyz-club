import { Component, signal } from '@angular/core';
import { Dashboard } from '../../components/ui/dashboard/dashboard';
import type { Widget } from '../../components/ui/dashboard/widget';
import { provideDashboardWidgets } from '../../components/ui/dashboard/widget-registry';

@Component({
  selector: 'app-pages-membership-campaign-dashboard',
  imports: [Dashboard],
  providers: [
    provideDashboardWidgets({
      welcome: () =>
        import('../../components/dashboard/widgets/welcome/welcome').then((m) => m.Welcome),
      'current-campaign': () =>
        import('../../components/dashboard/widgets/current-campaign/current-campaign').then(
          (m) => m.CurrentCampaign,
        ),
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class RootDashboard {
  widgets = signal<Widget[]>([
    { cols: 2, rows: 1, y: 0, x: 0, type: 'welcome', settings: {} },
    { cols: 2, rows: 1, y: 0, x: 2, type: 'current-campaign', settings: {} },
  ]);
}
