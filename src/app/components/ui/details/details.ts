import { NgTemplateOutlet } from "@angular/common";
import { Component, contentChildren } from '@angular/core';
import { DetailItem } from './detail-item';

@Component({
  selector: 'app-ui-details',
  imports: [NgTemplateOutlet],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details {
  items = contentChildren<DetailItem>(DetailItem);
}
