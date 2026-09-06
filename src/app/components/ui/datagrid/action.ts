export type DatagridAction<T = any> = {
  label: string;
  handler: (row: T) => void;
};

export type DatagridBulkAction<T = any> = {
  label: string;
  handler: (rows: T[]) => void;
};
