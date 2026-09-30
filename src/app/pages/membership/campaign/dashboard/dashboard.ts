import { Component, signal } from '@angular/core';
import { Dashboard } from '../../../../components/ui/dashboard/dashboard';
import { Widget } from '../../../../components/ui/dashboard/widget';
import { provideDashboardWidgets } from '../../../../components/ui/dashboard/widget-registry';

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
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class CampaignDashboard {
  widgets = signal<Widget[]>([
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
    }
  ]);
}
