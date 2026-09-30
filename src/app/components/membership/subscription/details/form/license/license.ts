import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { toDate, toInput } from '../../../../../../utils/date';

@Component({
  selector: 'app-membership-subscription-details-form-license',
  imports: [FormlyForm, MatDialogModule, MatButtonModule],
  templateUrl: './license.html',
  styleUrls: ['./license.css'],
})
export class License {
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<License>);

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
    },
    {
      key: 'license_taken',
      type: 'toggle',
      props: {
        label: $localize`:@@membership.subscriptions.licenseTaken:License taken`,
      },
      className: 'block mb-3',
      wrappers: [],
    },
    {
      key: 'license_taken_at',
      type: 'input',
      props: {
        type: 'date',
        label: $localize`:@@membership.subscriptions.licenseTakenAt:License taken at`,
      },
      expressions: {
        hide: '!model.license_taken',
        'props.required': 'model.license_taken',
      },
    },
  ];
  model = {
    license_type: '',
    identity_photo: '',
    medical_certificate: '',
    doctor: '',
    agree_image: false,
    agree_exit: false,
    license_taken: false,
    license_taken_at: '',
  };

  ngOnInit(): void {
    if (this.data?.model) {
      this.model = {
        ...this.data.model,
        license_taken: this.data.model.license_taken_at ?? false,
        license_taken_at: this.data.model.license_taken_at
          ? toInput(this.data.model.license_taken_at)
          : '',
      };
    } else {
      this.model = {
        license_type: '',
        identity_photo: '',
        medical_certificate: '',
        doctor: '',
        agree_image: false,
        agree_exit: false,
        license_taken: false,
        license_taken_at: '',
      };
    }
  }

  save() {
    if (this.form.valid) {
      const data = {
        license_type: this.model.license_type,
        identity_photo: this.model.identity_photo,
        medical_certificate: this.model.medical_certificate,
        doctor: this.model.doctor,
        agree_image: this.model.agree_image,
        agree_exit: this.model.agree_exit,
        license_taken_at: this.model.license_taken ? toDate(this.model.license_taken_at) : null,
      };
      this.dialogRef.close(data);
    }
  }
}
