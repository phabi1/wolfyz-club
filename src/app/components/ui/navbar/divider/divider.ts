import { Component, input } from '@angular/core';
import type { NavDivider } from '../nav-item';

@Component({
  selector: 'app-ui-navbar-divider',
  imports: [],
  templateUrl: './divider.html',
  styleUrls: ['./divider.css'],
})
export class Divider {
    item = input.required<NavDivider>();
}
