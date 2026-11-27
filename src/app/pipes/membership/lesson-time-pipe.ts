import { Pipe, PipeTransform } from '@angular/core';
import { Lesson } from '../../models/membership/lesson';
import { formatLessonTitle } from '../../utils/lesson';

@Pipe({
  name: 'lessonTime',
})
export class LessonTimePipe implements PipeTransform {
  transform(value: Lesson | null, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    }
    return formatLessonTitle(value);
  }
}
