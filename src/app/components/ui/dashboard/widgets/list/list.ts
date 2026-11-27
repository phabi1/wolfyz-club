import { Component, computed, contentChildren, input } from '@angular/core';
import { Card } from '../card/card';
import { ListItem } from './item';

@Component({
  selector: 'app-ui-dashboard-widget-list',
  imports: [Card],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List {
  title = input<string>('');
  heading = input<string>('');
  description = input<string>('');

  items = contentChildren(ListItem);

  isEmpty = computed(() => this.items().length === 0);
}
