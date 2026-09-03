import { Component, effect, inject, signal } from '@angular/core';
import { TotalWidget } from '../../../../ui/dashboard/widgets/total-widget/total-widget';
import { LessonService } from '../../../../../services/membership/lesson.service';

@Component({
  selector: 'app-membership-dashboard-widget-total-lesson',
  imports: [TotalWidget],
  templateUrl: './total-lesson.html',
  styleUrls: ['./total-lesson.css'],
})
export class TotalLesson {
  private readonly lessonService = inject(LessonService);

  readonly value = signal(0);
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.lessonService.items(2).subscribe({
        next: ({ total }) => {
          this.value.set(total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    });
  }
}
