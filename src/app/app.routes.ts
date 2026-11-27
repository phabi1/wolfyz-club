import { Routes } from '@angular/router';
import { isLoggedGuard } from './guards/is-logged-guard';
import { permissionGuard } from './guards/permission-guard';
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
        canActivate: [permissionGuard('billing.view')],
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
        canActivate: [permissionGuard('membership.view'), redirectToCampaignGuard],
        loadComponent: () => import('./pages/membership/home/home').then((m) => m.Home),
      },
      {
        path: 'membership/campaigns',
        canActivate: [permissionGuard('membership.view')],
        loadComponent: () =>
          import('./pages/membership/campaigns/campaigns').then((m) => m.Campaigns),
      },
      {
        path: 'membership/campaign/:campaignId',
        canActivate: [permissionGuard('membership.view'), selectCampaignGuard],
        data: { sidebar: 'membership-campaign' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/membership/campaign/dashboard/dashboard').then(
                (m) => m.CampaignDashboard,
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./pages/membership/campaign/settings/settings').then((m) => m.Settings),
          },
          {
            path: 'lessons',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/membership/campaign/lessons/list/list').then((m) => m.List),
                children: [
                  {
                    path: 'new',
                    loadComponent: () =>
                      import('./pages/membership/campaign/lessons/new/new').then((m) => m.New),
                  },
                ],
              },
              {
                path: ':lessonId',
                loadComponent: () =>
                  import('./pages/membership/campaign/lessons/details/details').then(
                    (m) => m.Details,
                  ),
                children: [
                  {
                    path: 'edit',
                    loadComponent: () =>
                      import('./pages/membership/campaign/lessons/edit/edit').then((m) => m.Edit),
                  },
                ],
              },
            ],
          },
          {
            path: 'periods',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/membership/campaign/periods/list/list').then((m) => m.List),
                children: [
                  {
                    path: 'new',
                    loadComponent: () =>
                      import('./pages/membership/campaign/periods/new/new').then((m) => m.New),
                  },
                ],
              },

              {
                path: ':periodId',
                loadComponent: () =>
                  import('./pages/membership/campaign/periods/details/details').then(
                    (m) => m.Details,
                  ),
                children: [
                  {
                    path: 'edit',
                    loadComponent: () =>
                      import('./pages/membership/campaign/periods/edit/edit').then((m) => m.Edit),
                  },
                ],
              },
            ],
          },
          {
            path: 'subscriptions',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/membership/campaign/subscriptions/list/list').then((m) => m.List),
              },
              {
                path: 'new',
                loadComponent: () =>
                  import('./pages/membership/campaign/subscriptions/new/new').then((m) => m.New),
              },
              {
                path: ':subscriptionId',
                loadComponent: () =>
                  import('./pages/membership/campaign/subscriptions/details/details').then(
                    (m) => m.Details,
                  ),
              },
            ],
          },
          {
            path: 'requests',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/membership/campaign/requests/list/list').then((m) => m.List),
              },
              {
                path: ':requestId',
                loadComponent: () =>
                  import('./pages/membership/campaign/requests/details/details').then(
                    (m) => m.Details,
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'users',
        canActivate: [permissionGuard('users.manage')],
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/user/users/list/list').then((m) => m.List),
            children: [
              {
                path: 'new',
                loadComponent: () => import('./pages/user/users/new/new').then((m) => m.New),
              },
            ],
          },
          {
            path: ':userId',
            loadComponent: () =>
              import('./pages/user/users/details/details').then((m) => m.Details),
            children: [
              {
                path: 'edit',
                loadComponent: () => import('./pages/user/users/edit/edit').then((m) => m.Edit),
              },
            ],
          },
        ],
      },
      {
        path: 'roles',
        canActivate: [permissionGuard('roles.manage')],
        loadComponent: () => import('./pages/user/roles/list/list').then((m) => m.List),
        children: [
          {
            path: 'new',
            loadComponent: () => import('./pages/user/roles/edit/edit').then((m) => m.Edit),
          },
          {
            path: ':roleId/edit',
            loadComponent: () => import('./pages/user/roles/edit/edit').then((m) => m.Edit),
          },
        ],
      },
      {
        path: 'forbidden',
        loadComponent: () => import('./pages/forbidden/forbidden').then((m) => m.Forbidden),
      },
      {
        path: 'event/events',
        canActivate: [permissionGuard('event.view')],
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/event/events/list/list').then((m) => m.List),
          },
          {
            path: 'new',
            loadComponent: () => import('./pages/event/events/new/new').then((m) => m.New),
          },
          {
            path: ':eventId',
            loadComponent: () =>
              import('./pages/event/events/details/details').then((m) => m.Details),
            children: [
              {
                path: 'participant/:participantId',
                loadComponent: () => import('./pages/event/events/info/info').then((m) => m.Info),
              },
              {
                path: 'copy',
                loadComponent: () => import('./pages/event/events/copy/copy').then((m) => m.Copy),
              },
            ],
          },
          {
            path: ':eventId/configure',
            loadComponent: () =>
              import('./pages/event/events/configure/configure').then((m) => m.Configure),
          },
        ],
      },
    ],
  },
  {
    path: 'signin',
    loadComponent: () => import('./pages/auth/signin/signin').then((m) => m.Signin),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
