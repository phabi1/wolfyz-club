import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-dashboard-widget-total-widget',
  imports: [],
  templateUrl: './total-widget.html',
  styleUrls: ['./total-widget.css'],
})
export class TotalWidget {
  count = input.required<number>();
  title = input.required<string>();
  subtitle = input<string>('');
}
