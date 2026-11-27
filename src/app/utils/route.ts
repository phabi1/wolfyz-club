import type { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, map, type Observable } from 'rxjs';

/** Current campaign id from the route (`membership/campaign/:campaignId`) */
export function campaignId$(route: ActivatedRoute): Observable<number> {
  return route.params.pipe(
    map((params) => +(params['campaignId'] || 0)),
    filter((id) => id > 0),
    distinctUntilChanged(),
  );
}

export function campaignIdSnapshot(route: ActivatedRoute): number {
  return +(route.snapshot.params['campaignId'] || 0);
}
