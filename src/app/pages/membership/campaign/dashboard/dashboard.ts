import { Component, signal } from '@angular/core';
import { Dashboard } from '../../../../components/ui/dashboard/dashboard';
import { Widget } from '../../../../components/ui/dashboard/widget';
import { provideDashboardWidgets } from '../../../../components/ui/dashboard/widget-registry';

@Component({
  selector: 'app-pages-membership-campaign-dashboard',
  imports: [Dashboard],
  providers: [
    provideDashboardWidgets({
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
    }),
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class CampaignDashboard {
  widgets = signal<Widget[]>([
    { id: "1", cols: 2, rows: 1, y: 0, x: 0, type: 'total-subscriptions', settings: {} },
    { id: "2", cols: 2, rows: 1, y: 0, x: 2, type: 'total-lessons', settings: {} },
    { id: "3", cols: 2, rows: 1, y: 0, x: 4, type: 'total-periods', settings: {} },
    { id: "4", cols: 2, rows: 3, y: 1, x: 2, type: 'lesson-completude', settings: {} },
    { id: "5", cols: 2, rows: 2, y: 1, x: 4, type: 'print-period', settings: {} },
  ]);
}
