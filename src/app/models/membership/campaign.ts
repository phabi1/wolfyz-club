export type Campaign = {
  id: number;
  title: string;
  registration_start: Date | null;
  registration_end: Date | null;
  settings: Record<string, unknown>;
};
