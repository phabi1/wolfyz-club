import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import type { Lesson } from '../../../../../models/membership/lesson';
import { membershipLessonList } from '../../../../../stores/membership/lessons/list';
import { Page } from '../../../../../components/ui/page/page';
import { Badge } from '../../../../../components/ui/badge/badge';
import { CollectionItemAction, Collection as UiCollection } from '../../../../../components/ui/collection/collection';
import { formatDay } from '../../../../../utils/date';

type LessonGroup = {
  day: number;
  title: string;
  items: Lesson[];
};

@Component({
  selector: 'app-pages-membership-campaign-lessons-list',
  imports: [Page, UiCollection, Badge, RouterOutlet],
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
  readonly untitledLessonLabel = $localize`:@@membership.lessons.untitled:Untitled lesson`;
  readonly noDescriptionLabel = $localize`:@@membership.lessons.noDescription:No description`;
  readonly notAvailableLabel = $localize`:@@common.label.na:N/A`;
  readonly notProvidedLabel = $localize`:@@common.label.notProvided:Not provided`;

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

  onAdd(): void {
    const campaignId = +(this.route.snapshot.paramMap.get('campaignId') || 0);
    if (!campaignId) {
      return;
    }

    this.router.navigate(['/membership/campaign', campaignId, 'lessons', 'new']);
  }

  onLessonClick(item: Lesson, index: number): void {
    this.router.navigate([
      '/membership/campaign',
      this.route.snapshot.paramMap.get('campaignId'),
      'lessons',
      item.id,
    ]);
  }

  formatTime(value: Date | string | number | null | undefined): string {
    if (!value) {
      return this.notProvidedLabel;
    }

    const parsed = this.toDate(value);
    if (Number.isNaN(parsed.getTime())) {
      return this.notProvidedLabel;
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
