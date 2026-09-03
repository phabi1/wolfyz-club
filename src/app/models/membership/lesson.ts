export type Lesson = {
    id: number;
    campaign_id: number;
    title: string;
    description?: string;
    day: number;
    lesson_start: number;
    lesson_end: number;
    age_min?: number;
    age_max?: number;
    participant_nb: number;
    participant_max: number;
};