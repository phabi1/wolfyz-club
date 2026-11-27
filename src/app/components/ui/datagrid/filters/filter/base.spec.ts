import { TestBed } from '@angular/core/testing';

import { Base } from './base';

describe('Base', () => {
  it('should create an instance', () => {
    const directive = TestBed.runInInjectionContext(() => new Base());
    expect(directive).toBeTruthy();
  });
});
