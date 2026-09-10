import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseType } from './license-type';

describe('LicenseType', () => {
  let component: LicenseType;
  let fixture: ComponentFixture<LicenseType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseType],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
