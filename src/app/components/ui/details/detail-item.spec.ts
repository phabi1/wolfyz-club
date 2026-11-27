import { TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DetailItem } from './detail-item';

describe('DetailItem', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({ providers: [{ provide: TemplateRef, useValue: {} }] });
    const directive = TestBed.runInInjectionContext(() => new DetailItem());
    expect(directive).toBeTruthy();
  });
});
