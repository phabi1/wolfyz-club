import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailItem } from '../../../../components/ui/details/detail-item';
import { Details as UiDetails } from '../../../../components/ui/details/details';
import { PageAction } from '../../../../components/ui/page/action';
import { Page } from '../../../../components/ui/page/page';
import { DatePipe } from '../../../../pipes/date-pipe';
import { eventEventDetailsStore } from '../../../../stores/event/events/details';

@Component({
  selector: 'app-details',
  imports: [Page, UiDetails, DetailItem, DatePipe],
  providers: [eventEventDetailsStore],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  public readonly store = inject(eventEventDetailsStore);
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  public readonly pageActions: PageAction[] = [
    {
      label: 'Edit',
      handler: () => {
        this.router.navigate(['configure'], { relativeTo: this.route });
      },
    },
  ];
}
