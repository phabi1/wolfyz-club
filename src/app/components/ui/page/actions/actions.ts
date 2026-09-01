import { Component, computed, input } from '@angular/core';
import type { PageAction } from '../action';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ui-page-actions',
  imports: [RouterLink],
  templateUrl: './actions.html',
  styleUrls: ['./actions.css'],
})
export class Actions {
  actions = input<PageAction[]>([]);

  primaryActions = computed(() => this.actions().filter((action) => action.primary));

  hasPrimaryActions = computed(() => this.primaryActions().length > 0);

  secondaryActions = computed(() => this.actions().filter((action) => !action.primary));

  hasSecondaryActions = computed(() => this.secondaryActions().length > 0);
}
