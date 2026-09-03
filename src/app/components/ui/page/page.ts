import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Header } from './header/header';
import type { PageAction } from './action';

@Component({
  selector: 'app-ui-page',
  imports: [Header],
  templateUrl: './page.html',
  styleUrls: ['./page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Page {
  title = input('');
  subtitle = input('');
  actions = input<PageAction[]>([]);
}
