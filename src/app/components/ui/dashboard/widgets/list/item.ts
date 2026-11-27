import { Component } from '@angular/core';

@Component({
  selector: '[app-ui-dashboard-widget-list-item]',
  template: `
    <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <ng-content></ng-content>
    </div>
  `,
})
export class ListItem {}