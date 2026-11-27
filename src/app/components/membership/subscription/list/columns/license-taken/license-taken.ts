import { Component, computed } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cell } from '../../../../../../components/ui/datagrid/cell';
import { YesNo } from '../../../../../ui/yes-no/yes-no';
import { DatePipe } from '../../../../../../pipes/date-pipe';

@Component({
  selector: 'app-membership-subscription-list-columns-license-taken',
  imports: [YesNo, MatTooltipModule, DatePipe],
  templateUrl: './license-taken.html',
  styleUrls: ['./license-taken.css'],
})
export class LicenseTaken extends Cell<Date | null> {
  taken = computed<boolean>(() => this.value() !== null && this.value() instanceof Date);
  takenAt = computed<Date>(() => {
    const value = this.value();
    return value !== null && value instanceof Date ? value : new Date();
  });
}
