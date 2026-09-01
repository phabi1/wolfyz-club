import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { provideConfig } from './services/config.service';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';

export function setup(config: any): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideConfig(config),
      provideHttpClient(withInterceptorsFromDi()),
      provideOAuthClient({
        resourceServer: {
          allowedUrls: [window.location.origin],
          sendAccessToken: true,
        },
      }),
      provideRouter(routes),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideFormlyCore(withFormlyMaterial()),
    ],
  };
}
