import { Component, contentChildren } from '@angular/core';
import { DetailItem } from './detail-item';
import { NgClass, NgTemplateOutlet } from "@angular/common";

@Component({
  selector: 'app-ui-details',
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  items = contentChildren<DetailItem>(DetailItem);
}
