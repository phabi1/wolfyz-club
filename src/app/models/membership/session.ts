import { Lesson } from "./lesson";

export type Session = {
  id: number;
  lesson_id: number;
  lesson: Lesson;
  member_id: number;
  subscription_id: number;
};
