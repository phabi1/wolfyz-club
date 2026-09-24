import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ParticipantItem } from '../participant-item/participant-item';
import { Lesson } from '../../../../../../models/membership/lesson';

@Component({
  selector: 'app-membership-request-details-info-participants',
  imports: [CommonModule, ParticipantItem],
  templateUrl: './participants.html',
  styleUrl: './participants.css',
})
export class Participants {
  participants = input.required<any[]>();
  lessons = input.required<Lesson[]>();

  readonly lessonNotProvidedLabel = $localize`:@@membership.requests.participants.lessonNotProvided:Lesson not provided`;
  readonly unknownLabel = $localize`:@@membership.requests.unknown:Unknown`;
}
