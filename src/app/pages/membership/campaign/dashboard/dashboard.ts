import { Component, computed, inject } from '@angular/core';
import { Dashboard } from '../../../../components/ui/dashboard/dashboard';
import { Widget } from '../../../../components/ui/dashboard/widget';
import { provideDashboardWidgets } from '../../../../components/ui/dashboard/widget-registry';
import type { Permission } from '../../../../models/user/permission';
import { AuthService } from '../../../../services/auth.service';

/** Widgets whose data needs a permission (the API refuses it otherwise). */
const WIDGET_PERMISSIONS: Record<string, Permission> = {
  'total-requests': 'membership.request.view',
  'total-request-status': 'membership.request.view',
  'latest-requests': 'membership.request.view',
  'total-subscriptions': 'membership.subscription.view',
  'gender-distribution': 'membership.subscription.view',
  'age-distribution': 'membership.subscription.view',
};

@Component({
  selector: 'app-pages-membership-campaign-dashboard',
  imports: [Dashboard],
  providers: [
    provideDashboardWidgets({
      'total-requests': () =>
        import('../../../../components/membership/dashboard/widgets/total-requests/total-requests').then(
          (m) => m.TotalRequests,
        ),
      'total-request-status': () =>
        import('../../../../components/membership/dashboard/widgets/total-request-status/total-request-status').then(
          (m) => m.TotalRequestStatus,
        ),
      'total-subscriptions': () =>
        import('../../../../components/membership/dashboard/widgets/total-subscriptions/total-subscriptions').then(
          (m) => m.TotalSubscriptions,
        ),
      'total-lessons': () =>
        import('../../../../components/membership/dashboard/widgets/total-lesson/total-lesson').then(
          (m) => m.TotalLesson,
        ),
      'total-periods': () =>
        import('../../../../components/membership/dashboard/widgets/total-periods/total-periods').then(
          (m) => m.TotalPeriods,
        ),
      'lesson-completude': () =>
        import('../../../../components/membership/dashboard/widgets/lesson-completude/lesson-completude').then(
          (m) => m.LessonCompletude,
        ),
      'print-period': () =>
        import('../../../../components/membership/dashboard/widgets/print-period/print-period').then(
          (m) => m.PrintPeriod,
        ),
      'latest-requests': () =>
        import('../../../../components/membership/dashboard/widgets/last-requests/last-requests').then(
          (m) => m.LastRequests,
        ),
        'gender-distribution': () =>
        import('../../../../components/membership/dashboard/widgets/gender-distribution/gender-distribution').then(
          (m) => m.GenderDistribution,
        ),
      'age-distribution': () =>
        import('../../../../components/membership/dashboard/widgets/age-distribution/age-distribution').then(
          (m) => m.AgeDistribution,
        ),
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class CampaignDashboard {
  private readonly authService = inject(AuthService);

  private readonly allWidgets: Widget[] = [
    { id: '6', cols: 2, rows: 1, y: 0, x: 0, type: 'total-requests', settings: {} },
    { id: '1', cols: 2, rows: 1, y: 0, x: 2, type: 'total-subscriptions', settings: {} },
    { id: '2', cols: 2, rows: 1, y: 0, x: 4, type: 'total-lessons', settings: {} },
    { id: '3', cols: 2, rows: 1, y: 0, x: 6, type: 'total-periods', settings: {} },
    { id: '4', cols: 2, rows: 4, y: 1, x: 4, type: 'lesson-completude', settings: {} },
    { id: '5', cols: 2, rows: 2, y: 1, x: 6, type: 'print-period', settings: {} },
    {
      id: '7',
      cols: 1,
      rows: 1,
      y: 1,
      x: 0,
      type: 'total-request-status',
      settings: { status: 'pending' },
    },
    {
      id: '8',
      cols: 1,
      rows: 1,
      y: 1,
      x: 1,
      type: 'total-request-status',
      settings: { status: 'paid' },
    },
    {
      id: '9',
      cols: 2,
      rows: 4,
      y: 2,
      x: 0,
      type: 'latest-requests',
      settings: {},
    },
    {
      id: '10',
      cols: 2,
      rows: 3,
      y: 2,
      x: 2,
      type: 'gender-distribution',
      settings: {},
    },
    {
      id: '11',
      cols: 4,
      rows: 3,
      y: 5,
      x: 2,
      type: 'age-distribution',
      settings: {},
    },
  ];

  /** Widgets the user's permissions give access to. */
  readonly widgets = computed(() => {
    this.authService.permissions();
    return this.allWidgets.filter((widget) => {
      const permission = WIDGET_PERMISSIONS[widget.type];
      return !permission || this.authService.hasPermission(permission);
    });
  });
}
