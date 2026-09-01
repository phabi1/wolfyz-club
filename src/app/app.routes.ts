import { Routes } from '@angular/router';
import { isLoggedGuard } from './guards/is-logged-guard';
import { redirectToCampaignGuard } from './guards/redirect-to-campaign-guard';
import { selectCampaignGuard } from './guards/select-campaign-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedGuard],
    loadComponent: () => import('./layouts/default/default').then((m) => m.DefaultLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.RootDashboard),
      },
      {
        path: 'billing/payments',
        loadComponent: () => import('./pages/billing/payments/list/list').then((m) => m.List),
        children: [
          {
            path: 'new',
            loadComponent: () => import('./pages/billing/payments/new/new').then((m) => m.New),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/billing/payments/details/details').then((m) => m.Details),
          },
        ],
      },
      {
        path: 'membership',
        canActivate: [redirectToCampaignGuard],
        loadComponent: () => import('./pages/membership/home/home').then((m) => m.Home),
      },
      {
        path: 'membership/campaigns',
        loadComponent: () =>
          import('./pages/membership/campaigns/campaigns').then((m) => m.Campaigns),
      },
      {
        path: 'membership/campaign/:campaignId',
        canActivate: [selectCampaignGuard],
        data: { sidebar: 'membership-campaign' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/membership/campaign/dashboard/dashboard').then(
                (m) => m.CampaignDashboard,
              ),
          },
        ],
      },
    ],
  },

  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
