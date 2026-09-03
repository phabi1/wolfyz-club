import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import type { DatagridAction } from '../../../../../components/ui/datagrid/action';
import { Datagrid } from '../../../../../components/ui/datagrid/datagrid';
import type { Lesson } from '../../../../../models/membership/lesson';
import { membershipLessonList, membershipLessonListEvents } from '../../../../../stores/membership/lessons/list';
import { Page } from '../../../../../components/ui/page/page';
import type { PageAction } from '../../../../../components/ui/page/action';
import { LessonService } from '../../../../../services/membership/lesson.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pages-membership-campaign-lessons-list',
  imports: [Page, Datagrid],
  providers: [membershipLessonList],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  readonly store = inject(membershipLessonList);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly dispatcher = inject(Dispatcher);
  readonly lessonService = inject(LessonService);

  actions: PageAction[] = [
    {
      label: 'Ajouter',
      primary: true,
      handler: () => {
        void this.onAdd();
      },
    },
  ];

  rowActions: DatagridAction<Lesson>[] = [
    {
      label: 'View',
      handler: (row: Lesson) => {
        this.router.navigate([
          '/membership/campaign',
          this.route.snapshot.paramMap.get('campaignId'),
          'lessons',
          row.id,
        ]);
      },
    },
  ];

  onPaginationChange({ page, size }: { page: number; size: number }) {
    this.dispatcher.dispatch(membershipLessonListEvents.setPagination({ page, size }));
  }

  onSearchChange(search: string) {
    this.dispatcher.dispatch(membershipLessonListEvents.setSearch(search));
  }

  async onAdd(): Promise<void> {
    const campaignId = +(this.route.snapshot.paramMap.get('campaignId') || 0);
    if (!campaignId) {
      return;
    }

    const now = new Date();
    const start = new Date(now);
    start.setHours(18, 0, 0, 0);

    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const created = await firstValueFrom(
      this.lessonService.create(campaignId, {
        title: 'Nouveau cours',
        description: '',
        day: 1,
        lesson_start: start.getTime(),
        lesson_end: end.getTime(),
        participant_max: 0,
      }),
    );

    if (!created?.id) {
      return;
    }

    await this.router.navigate([
      '/membership/campaign',
      campaignId,
      'lessons',
      created.id,
    ]);
  }
}
