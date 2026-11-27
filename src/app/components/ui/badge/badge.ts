import { ChangeDetectionStrategy, Component, computed, HostBinding, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrls: ['./badge.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Badge {

  @HostBinding('class')
  get classNames() {
    const defaultClass = 'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs';
    let toneClass = '';
    switch (this.tone()) {
      case 'neutral':
        toneClass = 'bg-slate-500 text-white';
        break;
      case 'info':
        toneClass = 'bg-blue-500 text-white';
        break;
      case 'success':
        toneClass = 'bg-green-500 text-white';
        break;
      case 'warning':
        toneClass = 'bg-yellow-500 text-white';
        break;
      case 'danger':
        toneClass = 'bg-red-500 text-white';
        break;
    }
    return `${defaultClass} ${toneClass}`;
  }

  readonly label = input<string>('Badge');
  readonly tone = input<'neutral' | 'info' | 'success' | 'warning' | 'danger'>('neutral');

  readonly badgeClass = computed(() => {
    
    return `inline-flex items-center justify-center rounded-full px-2 py-1 text-xs badge badge--${this.tone()}`;
  });
}
