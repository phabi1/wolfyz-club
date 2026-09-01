import { CanActivateFn } from '@angular/router';

export const selectCampaignGuard: CanActivateFn = (route, state) => {
  localStorage.setItem('campaignId', route.params['campaignId']);
  return true;
};
