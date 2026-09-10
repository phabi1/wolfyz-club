import { Component, computed } from '@angular/core';
import { Cell } from '../../../../../ui/datagrid/cell';
import { Avatar as UiAvatar } from '../../../../member/avatar/avatar';

@Component({
  selector: 'app-membership-subscription-list-column-avatar',
  imports: [UiAvatar],
  templateUrl: './avatar.html',
  styleUrls: ['./avatar.css'],
})
export class Avatar extends Cell {
}
