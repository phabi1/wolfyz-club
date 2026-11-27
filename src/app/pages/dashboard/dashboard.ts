import { Component, computed, inject } from '@angular/core';
import { Dashboard } from '../../components/ui/dashboard/dashboard';
import type { Widget } from '../../components/ui/dashboard/widget';
import { provideDashboardWidgets } from '../../components/ui/dashboard/widget-registry';
import { MEMBERSHIP_VIEW, type Permission } from '../../models/user/permission';
import { AuthService } from '../../services/auth.service';

/** Widgets whose data needs one of these permissions (the API refuses it otherwise). */
const WIDGET_PERMISSIONS: Record<string, Permission[]> = {
  'current-campaign': MEMBERSHIP_VIEW,
  'bank-amount': ['billing.view'],
};

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
        'bank-amount': () =>
        import('../../components/dashboard/widgets/bank-amount/bank-amount').then(
          (m) => m.BankAmount,
        ),
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class RootDashboard {
  private readonly authService = inject(AuthService);

  private readonly allWidgets: Widget[] = [
    { cols: 2, rows: 2, y: 0, x: 0, type: 'welcome', settings: {} },
    { cols: 2, rows: 2, y: 0, x: 2, type: 'current-campaign', settings: {} },
    { cols: 1, rows: 2, y: 1, x: 0, type: 'bank-amount', settings: {} },
  ];

  /** Widgets the user's permissions give access to. */
  readonly widgets = computed(() => {
    this.authService.permissions();
    return this.allWidgets.filter((widget) => {
      const permissions = WIDGET_PERMISSIONS[widget.type];
      return !permissions || this.authService.hasPermission(...permissions);
    });
  });
}
