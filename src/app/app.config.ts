import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { provideFormly } from './formly.config';
import { provideDatagrid } from './components/ui/datagrid/provider';
import { provideConfig } from './services/config.service';

export function setup(config: any): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideConfig(config),
      provideHttpClient(withInterceptorsFromDi()),
      provideOAuthClient({
        resourceServer: {
          // The auth server's user API (/api/users) also requires the access token.
          allowedUrls: [config.api.endpoint, `${config.auth.issuer}/api/`],
          sendAccessToken: true,
        },
      }),
      provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideDatagrid({}),
      provideFormly(),
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    ],
  };
}
