import { Component, computed, input } from '@angular/core';
import { Lesson } from '../../../../../../models/membership/lesson';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-membership-request-lesson-capacity',
  imports: [NgClass],
  templateUrl: './lesson-capacity.html',
  styleUrls: ['./lesson-capacity.css'],
})
export class LessonCapacity {
  lesson = input.required<Lesson>();

  nb = computed(() => this.lesson().participant_nb);
  max = computed(() => this.lesson().participant_max);

  color = computed(() => {
    const nb = this.nb();
    const max = this.max();
    if (nb >= max) {
      return 'bg-red-200';
    }
    if (nb / max >= 0.8) {
      return 'bg-yellow-200';
    }
    return 'bg-green-200';
  });
}
