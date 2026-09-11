import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldToggle } from '@ngx-formly/material/toggle';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { AddressFieldType } from './components/form/field/address/address';
import { PhoneFieldType } from './components/form/field/phone/phone';
import { UploadFieldType } from './components/form/field/upload/upload';
import { provideDatagrid } from './components/ui/datagrid/provider';
import { AmountFieldType } from './components/ui/formly/fields/amount/amount-field';
import { TabsFieldType } from './components/ui/formly/fields/tabs/tabs-field';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideConfig } from './services/config.service';
import { Collection } from './components/form/field/collection/collection';

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
        withFormlyFieldToggle(),
        withFormlyFieldDatepicker(),
        {
          types: [
            { name: 'tabs', component: TabsFieldType },
            { name: 'amount', component: AmountFieldType },
            {
              name: 'address',
              component: AddressFieldType,
              defaultOptions: {
                defaultValue: { line1: '', line2: '', zipcode: '', city: '', country: '' },
              },
            },
            {
             name: 'phone',
             component: PhoneFieldType,
            },
            {
              name: 'upload',
              component: UploadFieldType,
            },
            {
              name: 'collection',
              component: Collection
            }
          ],
        },
      ]),
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    ],
  };
}
