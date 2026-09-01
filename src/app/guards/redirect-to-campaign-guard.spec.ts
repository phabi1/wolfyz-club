import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectToCampaignGuard } from './redirect-to-campaign-guard';

describe('redirectToCampaignGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => redirectToCampaignGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
