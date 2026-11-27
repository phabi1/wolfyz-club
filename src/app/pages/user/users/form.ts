import { Validators } from '@angular/forms';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Observable } from 'rxjs';
import type { Role } from '../../../models/user/role';

export type UserFormModel = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  email_verified: boolean;
  roles: string[];
};

export function emptyUserFormModel(): UserFormModel {
  return {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    email_verified: false,
    roles: [],
  };
}

/**
 * Fields of the user creation and edition dialogs. The password is optional in
 * both cases: on creation the user then sets it with "forgot password", on
 * edition an empty value keeps the current password.
 *
 * $selfEdit: the signed-in user edits their own account; the API refuses that
 * they change their own roles.
 */
export function userFormFields(
  mode: 'create' | 'edit',
  roles$: Observable<{ items: Role[] }>,
  selfEdit = false,
): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid grid-cols-1 gap-x-4 md:grid-cols-2',
      fieldGroup: [
        {
          key: 'firstname',
          type: 'input',
          props: {
            label: $localize`:@@user.users.form.firstname:First name`,
            required: true,
            maxLength: 190,
          },
        },
        {
          key: 'lastname',
          type: 'input',
          props: {
            label: $localize`:@@user.users.form.lastname:Last name`,
            required: true,
            maxLength: 190,
          },
        },
      ],
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: $localize`:@@common.label.email:Email`,
        type: 'email',
        required: true,
        maxLength: 190,
      },
      validators: { validation: [Validators.email] },
    },
    {
      key: 'password',
      type: 'input',
      props: {
        label: $localize`:@@user.users.form.password:Password`,
        type: 'password',
        minLength: 8,
        maxLength: 72,
        attributes: { autocomplete: 'new-password' },
        description:
          mode === 'create'
            ? $localize`:@@user.users.form.passwordCreateHint:Optional. Without a password, the user sets one with "Forgot password".`
            : $localize`:@@user.users.form.passwordEditHint:Leave empty to keep the current password.`,
      },
    },
    {
      key: 'email_verified',
      type: 'toggle',
      props: { label: $localize`:@@user.users.form.emailVerified:Email verified` },
    },
    {
      key: 'roles',
      type: 'select',
      props: {
        label: $localize`:@@user.users.form.roles:Roles`,
        multiple: true,
        disabled: selfEdit,
        options: roles$.pipe(
          map(({ items }) => items.map((role) => ({ value: role.id, label: role.label }))),
        ),
        description: selfEdit
          ? $localize`:@@user.users.form.rolesSelfHint:You cannot change your own roles.`
          : $localize`:@@user.users.form.rolesHint:You can only grant roles whose permissions you have yourself.`,
      },
    },
  ];
}
