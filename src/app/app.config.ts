import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
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
      provideHttpClient(withInterceptors([tokenInterceptor])),
      provideOAuthClient({
        resourceServer: {
          allowedUrls: [window.location.origin],
          sendAccessToken: true,
        },
      }),
      provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
      provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000',
      }),
      provideFormlyCore(withFormlyMaterial()),
    ],
  };
}
