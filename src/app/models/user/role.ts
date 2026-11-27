import type { Permission } from './permission';

export type Role = {
  id: string;
  label: string;
  description: string | null;
  /** System roles (e.g. "admin") have every permission and are read-only. */
  is_system: boolean;
  permissions: Permission[];
  user_count: number;
  created_at: Date | null;
};

export type RoleRef = Pick<Role, 'id' | 'label'>;

export type RoleData = {
  id?: string;
  label: string;
  description?: string | null;
  permissions: Permission[];
};
