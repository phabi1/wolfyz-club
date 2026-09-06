import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-navbar-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrls: ['./badge.css'],
})
export class Badge {
  text = input.required<string>();
  color = input<string>(''); 
}
