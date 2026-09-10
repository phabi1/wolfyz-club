import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormlyModule } from '@ngx-formly/core';
import type { Subscription } from '../../../../../../models/membership/subscription';
import { NotProvidedPipe } from '../../../../../../pipes/not-provided-pipe';
import { formatBirthday } from '../../../../../../utils/date';
import { Address } from '../../../../../ui/address/address';
import { Badge } from '../../../../../ui/badge/badge';
import { DetailItem } from '../../../../../ui/details/detail-item';
import { Details } from '../../../../../ui/details/details';
import { GhostingCircle } from '../../../../../ui/ghosting/circle/circle';
import { GhostingLine } from '../../../../../ui/ghosting/line/line';
import { GhostingRectangle } from '../../../../../ui/ghosting/rectangle/rectangle';
import { Avatar } from '../../../../member/avatar/avatar';
import { Member } from '../../form/member/member';

@Component({
  selector: 'app-membership-subscription-details-member-section',
  imports: [
    Badge,
    Address,
    GhostingCircle,
    GhostingLine,
    GhostingRectangle,
    Avatar,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormlyModule,
    Details,
    DetailItem,
    NotProvidedPipe,
    MatButtonModule
  ],
  templateUrl: './member.html',
  styleUrl: './member.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberSection {
  private dialog = inject(MatDialog);

  item = input.required<Subscription>();
  busy = input<boolean>(false);

  change = output<any>();

  showForm() {
    this.dialog
      .open(Member, {
        data: {
          model: { ...this.item().member },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.change.emit(result);
        }
      });
  }

  formatBirthday(value: string | Date | number): string | null {
    return formatBirthday(value);
  }
}
