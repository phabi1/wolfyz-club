import { SelectedRows } from "./selected-rows";

export type DatagridAction<T = any> = {
  label: string;
  handler: (row: T) => void;
};

export type DatagridBulkAction = {
  name: string;
  label: string;
  handler: (payload: SelectedRows) => void;
};
