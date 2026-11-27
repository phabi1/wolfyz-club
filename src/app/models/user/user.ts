import type { RoleRef } from './role';

/** Account of the auth (OIDC) server, managed through its /api/users API. */
export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
  firstname: string | null;
  lastname: string | null;
  roles: RoleRef[];
  created_at: Date | null;
};

export type UserCreate = {
  email: string;
  firstname: string;
  lastname: string;
  /** Optional: without it, the user sets a password through "forgot password". */
  password?: string;
  name?: string;
  email_verified?: boolean;
  /** Role identifiers. */
  roles?: string[];
};

export type UserUpdate = Partial<UserCreate>;
