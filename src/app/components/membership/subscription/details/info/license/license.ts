import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Discipline } from '../../../../../../models/membership/discipline';
import { Subscription } from '../../../../../../models/membership/subscription';
import { SubscriptionDiscipline } from '../../../../../../models/membership/subscription-discipline';
import { NotProvidedPipe } from '../../../../../../pipes/not-provided-pipe';
import { DetailItem } from '../../../../../ui/details/detail-item';
import { Details } from '../../../../../ui/details/details';
import { FilePreview } from '../../../../../ui/file-preview/file-preview';
import { YesNo } from '../../../../../ui/yes-no/yes-no';
import { COMPETITION_LICENSE, License as LicenseForm } from '../../form/license/license';
import { DatePipe } from '../../../../../../pipes/date-pipe';
import { ageAt, MAJORITY_AGE } from '../../../../../../utils/date';

@Component({
  selector: 'app-membership-subscription-details-license-section',
  imports: [Details, DetailItem, NotProvidedPipe, FilePreview, YesNo, MatIcon, MatButtonModule, DatePipe],
  templateUrl: './license.html',
  styleUrls: ['./license.css'],
})
export class License {
  private readonly dialog = inject(MatDialog);
  
  item = input.required<Subscription>();

  disciplines = input<Discipline[]>([]);

  busy = input<boolean>(false);
  /** False hides the edit controls (no membership.subscription.edit permission). */
  canEdit = input<boolean>(true);

  /** Date the member age is computed at (campaign start), today when null */
  referenceDate = input<Date | null>(null);

  /** Minor at the reference date; unknown birthdates are treated as minors */
  readonly isMinor = computed(() => {
    const age = ageAt(this.item().member?.birthdate, this.referenceDate());
    return age === null || age < MAJORITY_AGE;
  });

  change = output<any>();

  readonly disciplinesLabel = $localize`:@@membership.subscriptions.disciplines:Disciplines`;

  readonly disciplineNames = computed(() => {
    const catalog = this.disciplines();
    return (this.item().disciplines ?? [])
      .map(
        (assignment) =>
          catalog.find((discipline) => discipline.id === assignment.discipline_id)?.title,
      )
      .filter((title): title is string => !!title)
      .join(', ');
  });

  readonly isCompetition = computed(() => this.item().license_type === COMPETITION_LICENSE);

  /** Fields relevant for the current license type */
  readonly visibleFields = computed(() =>
    this.fields.filter((field) => {
      if (field.competitionOnly) {
        return this.isCompetition();
      }
      if (field.minorOnly && !this.isMinor()) {
        return false;
      }
      if (field.hobbyOnly) {
        return !!this.item().license_type && !this.isCompetition();
      }
      return true;
    }),
  );

  fields: LicenseField[] = [
    {
      name: 'license_taken_at',
      label: $localize`:@@membership.subscriptions.licenseTakenAt:License taken at`,
      type: 'date',
      value: (item) => item.license_taken_at,
    },
    {
      name: 'medical_certificate',
      competitionOnly: true,
      label: $localize`:@@membership.subscriptions.medicalCertificate:Medical certificate`,
      type: 'file',
      value: (item) => item.medical_certificate,
    },
    {
      name: 'medical_certificate_date',
      competitionOnly: true,
      label: $localize`:@@membership.subscriptions.medicalCertificateTakenAt:Medical certificate taken at`,
      type: 'date',
      value: (item) => item.medical_certificate_date,
    },
    {
      name: 'medical_form',
      hobbyOnly: true,
      label: $localize`:@@membership.subscriptions.medicalForm:Health questionnaire`,
      type: 'file',
      value: (item) => item.medical_form,
    },
    {
      name: 'identity_photo',
      competitionOnly: true,
      label: $localize`:@@membership.subscriptions.identityPhoto:Identity photo`,
      type: 'file',
      value: (item) => item.identity_photo,
    },
    {
      name: 'license_paid',
      label: $localize`:@@membership.subscriptions.licensePaid:License paid`,
      type: 'bool',
      value: (item) => item.fields?.['license_paid'],
    },
    {
      name: 'doctor',
      competitionOnly: true,
      label: $localize`:@@membership.subscriptions.doctor:Doctor`,
      type: 'text',
      value: (item) => item.doctor,
    },
    {
      name: 'agree_exit',
      minorOnly: true,
      label: $localize`:@@membership.subscriptions.agreeExit:Agree exit`,
      type: 'bool',
      value: (item) => item.agree_exit,
    },
    {
      name: 'agree_image',
      label: $localize`:@@membership.subscriptions.agreeImage:Agree image`,
      type: 'bool',
      value: (item) => item.agree_image,
    },
  ];

  showForm() {
    const item = this.item();
    this.dialog
      .open(LicenseForm, {
        data: {
          model: {
            license_type: item.license_type ?? '',
            medical_certificate: item.medical_certificate ?? '',
            medical_certificate_date: item.medical_certificate_date,
            medical_form: item.medical_form ?? '',
            identity_photo: item.identity_photo ?? '',
            license_taken_at: item.license_taken_at,
            doctor: item.doctor ?? '',
            agree_exit: item.agree_exit ?? false,
            agree_image: item.agree_image ?? false,
            discipline_ids: (item.disciplines ?? []).map(
              (assignment) => assignment.discipline_id,
            ),
          },
          disciplines: this.disciplines(),
          isMinor: this.isMinor(),
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { discipline_ids, ...license } = result;
          this.change.emit({
            ...license,
            disciplines: this.toSubscriptionDisciplines(discipline_ids ?? []),
          });
        }
      });
  }

  // Maps selected discipline ids to pivot rows, reusing existing ids to
  // favor updates over delete/create pairs
  private toSubscriptionDisciplines(selectedIds: number[]): Partial<SubscriptionDiscipline>[] {
    const current = this.item().disciplines ?? [];
    const keptIds = new Set(
      current
        .filter((assignment) => selectedIds.includes(assignment.discipline_id))
        .map((assignment) => assignment.discipline_id),
    );
    const reusable = current.filter((assignment) => !keptIds.has(assignment.discipline_id));

    return selectedIds.map((disciplineId) => {
      const existing = current.find((assignment) => assignment.discipline_id === disciplineId);
      if (existing) {
        return { id: existing.id, discipline_id: disciplineId };
      }
      const reused = reusable.shift();
      return { id: reused?.id ?? 0, discipline_id: disciplineId };
    });
  }
}

type LicenseField = {
  name: string;
  label: string;
  type: 'file' | 'bool' | 'date' | 'text';
  value: (item: Subscription) => unknown;
  /** Only relevant for a competition license */
  competitionOnly?: boolean;
  /** Only relevant for a hobby (non-competition) license */
  hobbyOnly?: boolean;
  /** Only relevant for a minor member */
  minorOnly?: boolean;
};
