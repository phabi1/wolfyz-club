export type RequestHistoryItem = {
  id: number;
  request_id: number;
  status: string;
  params: Record<string, any>;
  changed_by: { id: number; display_name: string; user_email: string } | null;
  created_at: string;
  updated_at: string;
};
