import { TestBed } from '@angular/core/testing';

import { WidgetRegistry } from './widget-registry';

describe('WidgetRegistry', () => {
  let service: WidgetRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetRegistry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
