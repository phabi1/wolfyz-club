import { Component, effect, inject, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LessonService } from '../../../../../services/membership/lesson.service';
import type { Lesson } from '../../../../../models/membership/lesson';

@Component({
  selector: 'app-lesson-completude',
  imports: [MatProgressBarModule],
  templateUrl: './lesson-completude.html',
  styleUrls: ['./lesson-completude.css'],
})
export class LessonCompletude {
  private readonly lessonService: LessonService = inject(LessonService);
  lessons = signal<Lesson[]>([]);

  constructor() {
    effect(() => {
      this.lessonService.items(2).subscribe(response => {
        this.lessons.set(response.items);
      });
    });
  }
}
