import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Request } from '../../../../../models/membership/request';
import { RequestService } from '../../../../../services/membership/request.service';
import { ListItem } from '../../../../ui/dashboard/widgets/list/item';
import { List } from '../../../../ui/dashboard/widgets/list/list';
import { Status } from '../../../request/status/status';
import { DatePipe } from '../../../../../pipes/date-pipe';

@Component({
  selector: 'app-membership-dashboard-widget-last-requests',
  imports: [List, ListItem, Status, RouterLink, DatePipe],
  templateUrl: './last-requests.html',
  styleUrls: ['./last-requests.css'],
})
export class LastRequests {
  private readonly requestService = inject(RequestService);

  campaignId = computed(() => 2);

  items = signal<Request[]>([]);

  public constructor() {
    effect(() => {
      // Replace this with the actual logic to fetch the last requests
      const subscription = this.requestService
        .items(this.campaignId(), {
          size: 10,
          fields: ['firstname', 'lastname', 'status', 'updated_at'],
        })
        .subscribe({
          next: (res) => {
            this.items.set(res.items);
          },
          error: () => {
            this.items.set([]);
          },
        });
      return () => subscription.unsubscribe();
    });
  }
}
