import { TestBed } from '@angular/core/testing';

import { Cell } from './cell';

describe('Cell', () => {
  it('should create an instance', () => {
    const directive = TestBed.runInInjectionContext(() => new Cell());
    expect(directive).toBeTruthy();
  });
});
