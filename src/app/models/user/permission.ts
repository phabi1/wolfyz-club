/** Permissions defined by the auth server (App\User\Role\Permissions). */
export type Permission =
  | 'users.manage'
  | 'roles.manage'
  | 'billing.view'
  | 'billing.edit'
  | 'membership.campaign.view'
  | 'membership.campaign.edit'
  | 'membership.request.view'
  | 'membership.request.edit'
  | 'membership.subscription.view'
  | 'membership.subscription.edit'
  | 'event.view'
  | 'event.edit';

/** Translated labels; permissions unknown to the club fall back to the API description. */
export const PERMISSION_LABELS: Record<Permission, string> = {
  'users.manage': $localize`:@@permission.users.manage:Manage users`,
  'roles.manage': $localize`:@@permission.roles.manage:Manage roles`,
  'billing.view': $localize`:@@permission.billing.view:View billing`,
  'billing.edit': $localize`:@@permission.billing.edit:Edit billing`,
  'membership.campaign.view': $localize`:@@permission.membership.campaign.view:View membership campaigns`,
  'membership.campaign.edit': $localize`:@@permission.membership.campaign.edit:Edit membership campaigns`,
  'membership.request.view': $localize`:@@permission.membership.request.view:View membership requests`,
  'membership.request.edit': $localize`:@@permission.membership.request.edit:Process membership requests`,
  'membership.subscription.view': $localize`:@@permission.membership.subscription.view:View members`,
  'membership.subscription.edit': $localize`:@@permission.membership.subscription.edit:Edit members`,
  'event.view': $localize`:@@permission.event.view:View events`,
  'event.edit': $localize`:@@permission.event.edit:Edit events`,
};

/** Any of them gives access to the membership section (campaign dashboard). */
export const MEMBERSHIP_VIEW: Permission[] = [
  'membership.campaign.view',
  'membership.request.view',
  'membership.subscription.view',
];

export function permissionLabel(id: string, fallback?: string): string {
  return PERMISSION_LABELS[id as Permission] ?? fallback ?? id;
}
