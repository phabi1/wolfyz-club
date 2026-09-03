import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-yes-no',
  imports: [],
  templateUrl: './yes-no.html',
  styleUrl: './yes-no.css',
})
export class YesNo {
  value = input.required<boolean>()
}
