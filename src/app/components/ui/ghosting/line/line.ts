import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-ghosting-line',
  imports: [],
  templateUrl: './line.html',
  styleUrl: './line.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostingLine {
  width = input('6rem');
  height = input('0.7rem');
  rounded = input('0.4rem');
}
