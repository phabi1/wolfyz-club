import { Component, effect, inject, signal, computed } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LessonService } from '../../../../../services/membership/lesson.service';
import type { Lesson } from '../../../../../models/membership/lesson';
import { formatLessonTitle } from '../../../../../utils/lesson';

@Component({
  selector: 'app-lesson-completude',
  imports: [MatProgressBarModule],
  templateUrl: './lesson-completude.html',
  styleUrls: ['./lesson-completude.css'],
})
export class LessonCompletude {
  private readonly lessonService: LessonService = inject(LessonService);
  lessons = signal<Lesson[]>([]);

  sortedLessons = computed(() => {
    return this.lessons()
      .slice()
      .sort((a, b) => {
        const d1 = a.day === 0 ? 7 : a.day;
        const d2 = b.day === 0 ? 7 : b.day;
        if (d1 === d2) {
          return a.lesson_start.getTime() - b.lesson_start.getTime();
        }
        return d1 - d2;
      });
  });

  constructor() {
    effect(() => {
      this.lessonService.items(2).subscribe((response) => {
        this.lessons.set(response.items);
      });
    });
  }

  formatLessonTitle(lesson: Lesson): string {
    return formatLessonTitle(lesson);
  }
}
