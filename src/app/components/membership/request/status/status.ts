import { Component, input, computed } from '@angular/core';
import { Badge } from '../../../ui/badge/badge';
import { RequestStatusPipe } from '../../../../pipes/membership/request-status-pipe';

@Component({
  selector: 'app-membership-request-status',
  imports: [Badge, RequestStatusPipe],
  templateUrl: './status.html',
  styleUrls: ['./status.css'],
})
export class Status {
  status = input.required<string>();
  tone = computed(() => {
    switch (this.status()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  });
}
