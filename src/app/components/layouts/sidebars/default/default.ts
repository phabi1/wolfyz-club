import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout-sidebar-default',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './default.html',
  styleUrl: './default.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Default {
  
}
