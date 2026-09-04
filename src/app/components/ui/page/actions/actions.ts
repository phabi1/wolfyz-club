import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { PageAction } from '../action';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ui-page-actions',
  imports: [RouterLink, MatMenuModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './actions.html',
  styleUrls: ['./actions.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Actions {
  actions = input<PageAction[]>([]);

  primaryActions = computed(() => this.actions().filter((action) => action.primary));

  hasPrimaryActions = computed(() => this.primaryActions().length > 0);

  secondaryActions = computed(() => this.actions().filter((action) => !action.primary));

  hasSecondaryActions = computed(() => this.secondaryActions().length > 0);

  onActionClick(action: PageAction): void {
    action.handler?.();
  }
}
