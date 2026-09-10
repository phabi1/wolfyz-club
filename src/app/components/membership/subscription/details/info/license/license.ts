import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from '../../../../../../models/membership/subscription';
import { NotProvidedPipe } from '../../../../../../pipes/not-provided-pipe';
import { DetailItem } from '../../../../../ui/details/detail-item';
import { Details } from '../../../../../ui/details/details';
import { FilePreview } from '../../../../../ui/file-preview/file-preview';
import { YesNo } from '../../../../../ui/yes-no/yes-no';
import { License as LicenseForm } from '../../form/license/license';

@Component({
  selector: 'app-membership-subscription-details-license-section',
  imports: [Details, DetailItem, NotProvidedPipe, FilePreview, YesNo, MatIcon, MatButtonModule],
  templateUrl: './license.html',
  styleUrls: ['./license.css'],
})
export class License {
  private readonly dialog = inject(MatDialog);
  item = input.required<Subscription>();

  busy = input<boolean>(false);

  change = output<any>();

  fields = [
    {
      name: 'medical_certificate',
      label: $localize`:@@membership.subscriptions.medicalCertificate:Medical certificate`,
      type: 'file',
    },
    {
      name: 'identity_photo',
      label: $localize`:@@membership.subscriptions.identityPhoto:Identity photo`,
      type: 'file',
    },
    {
      name: 'license_paid',
      label: $localize`:@@membership.subscriptions.licensePaid:License paid`,
      type: 'bool',
    },
    {
      name: 'doctor',
      label: $localize`:@@membership.subscriptions.doctor:Doctor`,
      type: 'text',
    },
    {
      name: 'agree_exit',
      label: $localize`:@@membership.subscriptions.agreeExit:Agree exit`,
      type: 'bool',
    },
    {
      name: 'agree_image',
      label: $localize`:@@membership.subscriptions.agreeImage:Agree image`,
      type: 'bool',
    },
  ];

  showForm() {
    const item = this.item();
    this.dialog
      .open(LicenseForm, {
        data: {
          model: {
            license_type: item?.license_type ?? '',
            medical_certificate: item.fields['medical_certificate'] ?? '',
            identity_photo: item.fields['identity_photo'] ?? '',
            license_paid: item.fields['license_paid'] ?? false,
            doctor: item.fields['doctor'] ?? '',
            agree_exit: item.fields['agree_exit'] ?? false,
            agree_image: item.fields['agree_image'] ?? false,
          },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.change.emit(result);
        }
      });
  }
}
