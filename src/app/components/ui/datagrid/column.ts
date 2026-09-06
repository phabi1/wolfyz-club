export type DatagridColumn = {
  name: string;
  header: string;
  data?: string;
  type?: string;
  cell?: string | { type: string; options: Record<string, any> };
  filterable?: boolean | { type: string; options: Record<string, any> };
};
