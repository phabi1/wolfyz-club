import { Component, input } from '@angular/core';
import { Gridster, GridsterConfig, GridsterItem, GridsterItemConfig } from 'angular-gridster2';
import { Widget } from './widget';
import { WidgetOutlet } from "./widget-outlet/widget-outlet";

@Component({
  selector: 'app-ui-dashboard',
  imports: [Gridster, GridsterItem, WidgetOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  options!: GridsterConfig;
  widgets = input.required<Widget[]>();

  static itemChange(item: GridsterItemConfig, itemComponent: any) {
    console.info('itemChanged', item, itemComponent);
  }

  static itemResize(item: GridsterItemConfig, itemComponent: any) {
    console.info('itemResized', item, itemComponent);
  }

  ngOnInit() {
    this.options = {
      itemChangeCallback: Dashboard.itemChange,
      itemResizeCallback: Dashboard.itemResize,
    };
  }

  changedOptions() {
    this.options = Object.assign({}, this.options);
  }
}
