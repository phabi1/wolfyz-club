export type PaginationOptions = {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
  fields?: string[];
};