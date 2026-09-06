import { Lesson } from '../models/membership/lesson';
import { formatDay, formatTime } from './date';

export function formatLessonTitle(lesson: Lesson) {
  return (
    formatDay(lesson.day) +
    ' ' +
    formatTime(lesson.lesson_start) +
    ' - ' +
    formatTime(lesson.lesson_end)
  );
}
