import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-ghosting-circle',
  imports: [],
  templateUrl: './circle.html',
  styleUrl: './circle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostingCircle {
  size = input('2.5rem');
}
