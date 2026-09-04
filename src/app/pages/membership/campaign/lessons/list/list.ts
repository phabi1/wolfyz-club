import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import type { Lesson } from '../../../../../models/membership/lesson';
import { membershipLessonList } from '../../../../../stores/membership/lessons/list';
import { Page } from '../../../../../components/ui/page/page';
import { Collection as UiCollection } from '../../../../../components/ui/collection/collection';
import { formatDay } from '../../../../../utils/date';

type LessonGroup = {
  day: number;
  title: string;
  items: Lesson[];
};

@Component({
  selector: 'app-pages-membership-campaign-lessons-list',
  imports: [Page, UiCollection, RouterOutlet],
  providers: [membershipLessonList],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  readonly store = inject(membershipLessonList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly daysOrder = [1, 2, 3, 4, 5, 6, 0];

  readonly dayGroups = computed<LessonGroup[]>(() =>
    this.daysOrder.map((day) => ({
      day,
      title: formatDay(day),
      items: this.store
        .items()
        .filter((lesson) => lesson.day === day)
        .slice()
        .sort(
          (a, b) =>
            this.toTimestamp(a.lesson_start) - this.toTimestamp(b.lesson_start) ||
            a.title.localeCompare(b.title),
        ),
    })),
  );

  readonly lessonItemActions = [
    {
      label: 'Edit',
      handler: (lesson: Lesson, index: number) =>
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'lessons',
          lesson.id,
          'edit'
        ]),
    },
  ];

  onAdd(): void {
    const campaignId = +(this.route.snapshot.paramMap.get('campaignId') || 0);
    if (!campaignId) {
      return;
    }

    this.router.navigate(['/membership/campaign', campaignId, 'lessons', 'new']);
  }

  onLessonClick(day: number, index: number): void {
    const lesson = this.dayGroups().find((group) => group.day === day)?.items[index];
    if (!lesson) {
      return;
    }

    this.router.navigate([
      '/membership/campaign',
      this.route.snapshot.paramMap.get('campaignId'),
      'lessons',
      lesson.id,
    ]);
  }

  formatTime(value: Date | string | number | null | undefined): string {
    if (!value) {
      return 'Non renseignee';
    }

    const parsed = this.toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Non renseignee';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsed);
  }

  participantsLabel(current?: number | null, max?: number | null): string {
    const count = typeof current === 'number' ? current : 0;
    const cap = typeof max === 'number' ? max : null;

    if (cap === null || cap <= 0) {
      return `${count}`;
    }

    return `${count}/${cap}`;
  }

  private toTimestamp(value: Date | string | number): number {
    return this.toDate(value).getTime();
  }

  private toDate(value: Date | string | number): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
    }

    return new Date(value);
  }
}
