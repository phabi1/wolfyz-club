import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotProvidedPipe } from '../../../../../../pipes/not-provided-pipe';
import { GhostingLine } from '../../../../../ui/ghosting/line/line';
import { Details } from '../../../../../ui/details/details';
import { DetailItem } from '../../../../../ui/details/detail-item';
import { YesNo } from '../../../../../ui/yes-no/yes-no';
import { DatePipe } from '../../../../../../pipes/date-pipe';
import { LessonCapacity } from '../lesson-capacity/lesson-capacity';
import type { Lesson } from '../../../../../../models/membership/lesson';
import type { RequestParticipant } from '../../../../../../models/membership/request-participant';
import { Address } from '../../../../../ui/address/address';
import { LessonTimePipe } from '../../../../../../pipes/membership/lesson-time-pipe';

type Participant = Omit<RequestParticipant, 'address'> & {
  address: NonNullable<RequestParticipant['address']>;
  contacts?: Array<{
    email?: string;
    phone?: string;
    firstname: string;
    lastname: string;
  }>;
  member?: {
    status?: string;
  };
};

@Component({
  selector: 'app-membership-request-details-info-participant-item',
  imports: [
    CommonModule,
    NotProvidedPipe,
    GhostingLine,
    Details,
    DetailItem,
    YesNo,
    DatePipe,
    LessonCapacity,
    Address,
    LessonTimePipe
],
  templateUrl: './participant-item.html',
  styleUrl: './participant-item.css',
})
export class ParticipantItem {
  participant = input.required<Participant>();
  index = input<number>(0);
  lessons = input<Lesson[]>([]);

  lesson = computed(() => {
    if (!this.participant().lesson_id) {
      return null;
    }
    return (
      this.lessons().find((lesson) => lesson.id === Number(this.participant().lesson_id)) || null
    );
  });
}
