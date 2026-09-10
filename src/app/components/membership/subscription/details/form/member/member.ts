import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-membership-subscription-details-form-member',
  imports: [FormlyModule, MatDialogModule, MatButtonModule],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  private readonly data = inject(MAT_DIALOG_DATA);
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'firstname',
          type: 'input',
          props: {
            label: $localize`:@@membership.subscriptions.member.firstname:First name`,
            required: true,
          },
        },
        {
          key: 'lastname',
          type: 'input',
          props: {
            label: $localize`:@@membership.subscriptions.member.lastname:Last name`,
            required: true,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'birthdate',
          type: 'input',
          props: {
            type: 'date',
            label: $localize`:@@membership.subscriptions.member.birthdate:Birth date`,
            required: true,
          },
        },
        {
          key: 'gender',
          type: 'select',
          props: {
            label: $localize`:@@membership.member.gender:Gender`,
            required: true,
            options: [
              {
                label: $localize`:@@membership.subscriptions.member.gender.male:Male`,
                value: 'male',
              },
              {
                label: $localize`:@@membership.subscriptions.member.gender.female:Female`,
                value: 'female',
              },
            ],
          },
        },
      ],
    },
    {
      key: 'phone',
      type: 'phone',
      props: {
        label: $localize`:@@membership.subscriptions.member.phone:Phone`,
      },
    },
    {
      key: 'email',
      type: 'input',
      props: {
        type: 'email',
        label: $localize`:@@membership.subscriptions.member.email:Email`,
      },
    },
    {
      key: 'address',
      type: 'address',
      props: {
        label: $localize`:@@membership.subscriptions.member.address:Address`,
        required: true,
      },
    },

    {
      key: 'license_number',
      type: 'input',
      props: {
        label: $localize`:@@membership.subscriptions.member.license_number:License Number`,
      },
    },
  ];
  model = {
    firstname: '',
    lastname: '',
    birthdate: '',
    address: {},
    phone: '',
    email: '',
    gender: 'male',
    license_number: '',
  };

  ngOnInit(): void {
    this.model = this.data?.model ?? this.model;
  }
}
