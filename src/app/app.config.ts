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
import { provideDatagrid } from './components/ui/datagrid/provider';
import { AmountFieldType } from './components/ui/formly/fields/amount/amount-field';
import { LicensesFieldType } from './components/ui/formly/fields/licenses/licenses-field';
import { PaymentMethodsFieldType } from './components/ui/formly/fields/payment-methods/payment-methods-field';
import { TabsFieldType } from './components/ui/formly/fields/tabs/tabs-field';

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
      provideDatagrid({}),
      provideFormlyCore([
        ...withFormlyMaterial(),
        {
          types: [
            { name: 'tabs', component: TabsFieldType },
            { name: 'licenses', component: LicensesFieldType },
            { name: 'payment-methods', component: PaymentMethodsFieldType },
            { name: 'amount', component: AmountFieldType },
          ],
        },
      ]),
    ],
  };
}
