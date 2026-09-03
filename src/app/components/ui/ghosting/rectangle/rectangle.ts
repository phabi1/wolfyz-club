import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-ghosting-rectangle',
  imports: [],
  templateUrl: './rectangle.html',
  styleUrl: './rectangle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostingRectangle {
  width = input('100%');
  height = input('8rem');
  rounded = input('0.75rem');
}
