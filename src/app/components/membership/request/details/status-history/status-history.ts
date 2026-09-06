import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type HistoryItem = {
  status?: 'pending' | 'approved' | 'rejected' | 'canceled' | 'paid' | 'archived' | string;
  reason?: string;
  params?: {
    reason?: string;
  };
  action?: string;
  changed_by?: {
    display_name?: string;
  };
  created_at?: string | Date;
  changed_at?: string | Date;
};

@Component({
  selector: 'app-membership-request-details-status-history',
  imports: [],
  templateUrl: './status-history.html',
  styleUrls: ['./status-history.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusHistory {
  history = input<HistoryItem[]>([]);
  items = computed(() => this.history().reverse());
  empty = computed(() => this.history().length === 0);
  readonly unknownLabel = $localize`:@@membership.requests.unknown:Unknown`;
  readonly noReasonLabel = $localize`:@@membership.requests.noReasonProvided:No reason provided`;
  readonly notSpecifiedLabel = $localize`:@@membership.requests.notSpecified:Not specified`;
}
