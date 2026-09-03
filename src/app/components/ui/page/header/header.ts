import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Actions } from '../actions/actions';
import type { PageAction } from '../action';

@Component({
  selector: 'app-ui-page-header',
  imports: [Actions],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  title = input('');
  subtitle = input('');
  actions = input<PageAction[]>([]);
}
