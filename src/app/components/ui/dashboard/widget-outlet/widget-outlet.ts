import { Component, effect, inject, input, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { DASHBOARD_WIDGETS } from '../widget-registry';

@Component({
  selector: 'app-ui-dashboard-widget-outlet',
  imports: [NgComponentOutlet],
  templateUrl: './widget-outlet.html',
  styleUrls: ['./widget-outlet.css'],
})
export class WidgetOutlet {
  private widgetRegistry = inject(DASHBOARD_WIDGETS);

  type = input.required<string>();
  settings = input.required<Record<string, any>>();

  cmp = signal<Type<Component> | null>(null);

  constructor() {
    effect(async () => {
      const fn = this.widgetRegistry[this.type()];
      this.cmp.set(fn ? (await fn()): null);
    });
  }
}
