import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Lesson } from '../../../../models/membership/lesson';
import { RequestDetails } from '../../../../models/membership/request-details';
import { NotProvidedPipe } from '../../../../pipes/not-provided-pipe';
import { DetailItem } from '../../../ui/details/detail-item';
import { Details as UiDetails } from '../../../ui/details/details';
import { Participants } from "./info/participants/participants";
import { Status } from '../status/status';

@Component({
  selector: 'app-membership-request-details',
  imports: [Participants, NotProvidedPipe, UiDetails, DetailItem, Status],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  item = input.required<RequestDetails>();
  lessons = input.required<Lesson[]>();

  formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return  '';
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return  '';
    }

    return new Intl.DateTimeFormat('fr-FR').format(parsed);
  }
}
