import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type { PageAction } from '../action';
import { Actions } from '../actions/actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ui-page-header',
  imports: [Actions, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  headingTitle = input('');
  headingSubtitle = input('');
  actions = input<PageAction[]>([]);
  backLink = input<string>('');
}
