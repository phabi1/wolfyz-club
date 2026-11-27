/** Permissions defined by the auth server (App\User\Role\Permissions). */
export type Permission =
  | 'users.manage'
  | 'roles.manage'
  | 'billing.view'
  | 'billing.edit'
  | 'membership.view'
  | 'membership.edit'
  | 'event.view'
  | 'event.edit';

/** Translated labels; permissions unknown to the club fall back to the API description. */
export const PERMISSION_LABELS: Record<Permission, string> = {
  'users.manage': $localize`:@@permission.users.manage:Manage users`,
  'roles.manage': $localize`:@@permission.roles.manage:Manage roles`,
  'billing.view': $localize`:@@permission.billing.view:View billing`,
  'billing.edit': $localize`:@@permission.billing.edit:Edit billing`,
  'membership.view': $localize`:@@permission.membership.view:View memberships`,
  'membership.edit': $localize`:@@permission.membership.edit:Edit memberships`,
  'event.view': $localize`:@@permission.event.view:View events`,
  'event.edit': $localize`:@@permission.event.edit:Edit events`,
};

export function permissionLabel(id: string, fallback?: string): string {
  return PERMISSION_LABELS[id as Permission] ?? fallback ?? id;
}
