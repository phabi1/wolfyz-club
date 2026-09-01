export type DatagridAction<T = any> = {
  label: string;
  handler: (row: T) => void;
};