import { Component, input } from '@angular/core';
import { GhostingRectangle } from "../../../ghosting/rectangle/rectangle";
import { GhostingLine } from "../../../ghosting/line/line";

@Component({
  selector: 'app-ui-dashboard-widget-total-widget',
  imports: [GhostingRectangle, GhostingLine],
  templateUrl: './total-widget.html',
  styleUrls: ['./total-widget.css'],
})
export class TotalWidget {
  loading = input<boolean>(false);
  count = input.required<number>();
  title = input.required<string>();
  subtitle = input<string>('');
}
