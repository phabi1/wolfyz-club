import { Lesson } from "./lesson";

export type Session = {
  id: number;
  lesson_id: number;
  lesson: Lesson;
  subscription_id: number;
};
