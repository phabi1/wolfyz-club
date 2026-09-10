import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

@Component({
  selector: 'app-membership-subscription-details-form-license',
  imports: [FormlyForm, MatDialogModule, MatButtonModule],
  templateUrl: './license.html',
  styleUrls: ['./license.css'],
})
export class License {
  private readonly data = inject(MAT_DIALOG_DATA);

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'license_type',
      type: 'select',
      props: {
        label: $localize`:@@membership.subscriptions.member.license_type:License type`,
        required: true,
        options: [
          { label: $localize`:@@membership.subscriptions.licenseType.hobby:Hobby`, value: 'hobby' },
          {
            label: $localize`:@@membership.subscriptions.licenseType.competition:Competition`,
            value: 'competition',
          },
        ],
      },
    },
    {
      key: 'identity_photo',
      type: 'upload',
      props: {
        label: $localize`:@@membership.subscriptions.identityPhoto:Identity photo`,
        uploadUrl: '/membership/file/upload',
        removeUrl: '/membership/file/remove',
      },
    },
    {
      key: 'medical_certificate',
      type: 'upload',
      props: {
        label: $localize`:@@membership.subscriptions.medicalCertificate:Medical certificate`,
        uploadUrl: '/membership/file/upload',
        removeUrl: '/membership/file/remove',
      },
    },
    {
      key: 'doctor',
      type: 'input',
      props: {
        label: $localize`:@@membership.subscriptions.doctor:Doctor`,
      },
    },
    {
      key: 'agree_image',
      type: 'toggle',
      props: {
        label: $localize`:@@membership.subscriptions.agreeImage:Agree image`,
      },
      className: 'block mb-3',
      wrappers: [],
    },
    {
      key: 'agree_exit',
      type: 'toggle',
      props: {
        label: $localize`:@@membership.subscriptions.agreeExit:Agree exit`,
      },
      className: 'block mb-3',
      wrappers: [],
    }
  ];
  model = {
    license_type: '',
    identity_photo: '',
    medical_certificate: '',
    doctor: '',
    agree_image: false,
    agree_exit: false,
  };

  ngOnInit(): void {
    this.model = this.data?.model ?? this.model;
  }
}
