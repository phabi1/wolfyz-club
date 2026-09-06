import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-dashboard-widget-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  title = input<string>('');
  heading = input<string>('');
  description = input<string>('');
}
