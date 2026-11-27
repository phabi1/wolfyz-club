import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { provideDatagrid } from '../app/components/ui/datagrid/provider';
import { provideFormly } from '../app/formly.config';
import { ConfigService } from '../app/services/config.service';

/** Settings used by the services under test (no request leaves the test). */
export const TEST_CONFIG = {
  api: { endpoint: 'http://api.test', apiKey: 'test' },
  auth: { issuer: 'http://auth.test', clientId: 'club' },
};

/**
 * Providers most components need in a unit test: configuration, HTTP client
 * (backed by HttpTestingController), router, OIDC client, Formly field types
 * and datagrid cells.
 */
export function provideTestDefaults(): (Provider | EnvironmentProviders)[] {
  const config = new ConfigService();
  config.load(structuredClone(TEST_CONFIG));

  return [
    { provide: ConfigService, useValue: config },
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideOAuthClient(),
    provideFormly(),
    provideDatagrid({}),
  ];
}
