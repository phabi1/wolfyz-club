import { Component, inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import type { Discipline } from '../../../../../../models/membership/discipline';
import { fromDateInput, toDateInput } from '../../../../../../utils/date';

/** License types for which the medical documents and identity photo are needed */
export const COMPETITION_LICENSE = 'competition';

// Only shown (and required) for a competition license
const COMPETITION_ONLY = {
  hide: (field: FormlyFieldConfig) => field.model?.license_type !== COMPETITION_LICENSE,
  'props.required': (field: FormlyFieldConfig) =>
    field.model?.license_type === COMPETITION_LICENSE,
};

// Only shown (and required) for a hobby (non-competition) license: a health
// questionnaire is enough, the medical certificate replaces it in competition
const HOBBY_ONLY = {
  hide: (field: FormlyFieldConfig) =>
    !field.model?.license_type || field.model.license_type === COMPETITION_LICENSE,
  'props.required': (field: FormlyFieldConfig) =>
    !!field.model?.license_type && field.model.license_type !== COMPETITION_LICENSE,
};

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
        change: (field: FormlyFieldConfig) =>
          field.form?.get('discipline_ids')?.updateValueAndValidity(),
      },
    },

    {
      key: 'discipline_ids',
      type: 'select',
      props: {
        label: $localize`:@@membership.subscriptions.disciplines:Disciplines`,
        multiple: true,
        options: ((this.data?.disciplines ?? []) as Discipline[]).map((discipline) => ({
          label: discipline.title,
          value: discipline.id,
        })),
      },
      validators: {
        multipleDisciplines: {
          expression: (control: AbstractControl, field: FormlyFieldConfig) =>
            field.model?.license_type === 'competition' || (control.value ?? []).length <= 1,
          message: $localize`:@@membership.subscriptions.disciplines.multipleNotAllowed:Multiple disciplines are only allowed for a competition license`,
        },
      },
    },

    {
      key: 'medical_form',
      type: 'upload',
      props: {
        label: $localize`:@@membership.subscriptions.medicalForm:Health questionnaire`,
        uploadUrl: '/membership/file/upload',
        removeUrl: '/membership/file/remove',
      },
      expressions: HOBBY_ONLY,
    },
    {
      key: 'identity_photo',
      type: 'upload',
      props: {
        label: $localize`:@@membership.subscriptions.identityPhoto:Identity photo`,
        uploadUrl: '/membership/file/upload',
        removeUrl: '/membership/file/remove',
      },
      expressions: COMPETITION_ONLY,
    },
    {
      key: 'medical_certificate',
      type: 'upload',
      props: {
        label: $localize`:@@membership.subscriptions.medicalCertificate:Medical certificate`,
        uploadUrl: '/membership/file/upload',
        removeUrl: '/membership/file/remove',
      },
      expressions: COMPETITION_ONLY,
    },
    {
      key: 'medical_certificate_date',
      type: 'input',
      props: {
        type: 'date',
        label: $localize`:@@membership.subscriptions.medicalCertificateTakenAt:Medical certificate taken at`,
      },
      expressions: COMPETITION_ONLY,
    },
    {
      key: 'doctor',
      type: 'input',
      props: {
        label: $localize`:@@membership.subscriptions.doctor:Doctor`,
      },
      expressions: COMPETITION_ONLY,
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
  model: LicenseFormModel = emptyModel();

  ngOnInit(): void {
    const data = this.data?.model;
    if (!data) {
      this.model = emptyModel();
      return;
    }
    this.model = {
      license_type: data.license_type ?? '',
      identity_photo: data.identity_photo ?? '',
      medical_certificate: data.medical_certificate ?? '',
      medical_certificate_date: toDateInput(data.medical_certificate_date),
      medical_form: data.medical_form ?? '',
      doctor: data.doctor ?? '',
      agree_image: !!data.agree_image,
      agree_exit: !!data.agree_exit,
      license_taken: !!data.license_taken_at,
      license_taken_at: toDateInput(data.license_taken_at),
      discipline_ids: data.discipline_ids ?? [],
    };
  }

  save() {
    if (!this.form.valid) {
      return;
    }
    // Medical certificate, its date, doctor and identity photo only apply to
    // a competition license: they are cleared for any other license type
    const isCompetition = this.model.license_type === COMPETITION_LICENSE;
    const data = {
      license_type: this.model.license_type,
      identity_photo: isCompetition ? this.model.identity_photo || null : null,
      medical_certificate: isCompetition ? this.model.medical_certificate || null : null,
      medical_certificate_date: isCompetition
        ? fromDateInput(this.model.medical_certificate_date)
        : null,
      doctor: isCompetition ? this.model.doctor || null : null,
      medical_form: this.model.medical_form || null,
      agree_image: !!this.model.agree_image,
      agree_exit: !!this.model.agree_exit,
      license_taken_at: this.model.license_taken ? fromDateInput(this.model.license_taken_at) : null,
      discipline_ids: this.model.discipline_ids ?? [],
    };
    this.dialogRef.close(data);
  }
}

type LicenseFormModel = {
  license_type: string;
  identity_photo: string;
  medical_certificate: string;
  medical_certificate_date: string;
  medical_form: string;
  doctor: string;
  agree_image: boolean;
  agree_exit: boolean;
  license_taken: boolean;
  license_taken_at: string;
  discipline_ids: number[];
};

function emptyModel(): LicenseFormModel {
  return {
    license_type: '',
    identity_photo: '',
    medical_certificate: '',
    medical_certificate_date: '',
    medical_form: '',
    doctor: '',
    agree_image: false,
    agree_exit: false,
    license_taken: false,
    license_taken_at: '',
    discipline_ids: [],
  };
}
