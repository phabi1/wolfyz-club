import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YesNo } from "../../../../../ui/yes-no/yes-no";
import { DatePipe } from "../../../../../../pipes/date-pipe";
import { GhostingLine } from "../../../../../ui/ghosting/line/line";

@Component({
  selector: 'app-membership-request-details-info-participants',
  imports: [CommonModule, YesNo, DatePipe, GhostingLine],
  templateUrl: './participants.html',
  styleUrl: './participants.css',
})
export class Participants {
  participants = input<any[]>([])
}
