import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectToCampaignGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const campaignId = localStorage.getItem('campaignId');
  if (!!campaignId) {
    router.navigate([`/membership/campaign/${campaignId}`]);
    return false;
  } else {
    router.navigate(['/membership/campaigns']);
    return false;
  }
};
