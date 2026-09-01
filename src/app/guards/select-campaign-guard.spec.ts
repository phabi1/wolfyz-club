import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selectCampaignGuard } from './select-campaign-guard';

describe('selectCampaignGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => selectCampaignGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
