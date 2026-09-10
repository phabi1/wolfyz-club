import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-chip',
  imports: [NgClass],
  templateUrl: './chip.html',
  styleUrls: ['./chip.css'],
})
export class Chip {
  color = input('primary');
}
