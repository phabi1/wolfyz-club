import { Component } from '@angular/core';
import { Cell } from '../../../cell';

@Component({
  selector: 'app-number',
  imports: [],
  templateUrl: './number.html',
  styleUrl: './number.css',
})
export class Number extends Cell<number> {}
