import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly label = input<string>('Badge');
  readonly tone = input<'neutral' | 'success' | 'warning' | 'danger'>('neutral');

  readonly badgeClass = computed(() => `badge badge--${this.tone()}`);
}
