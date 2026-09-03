export type Campaign = {
  id: number;
  title: string;
  start_date?: Date | null;
  end_date?: Date | null;
  registration_start: Date | null;
  registration_end: Date | null;
  settings: Record<string, unknown>;
};
