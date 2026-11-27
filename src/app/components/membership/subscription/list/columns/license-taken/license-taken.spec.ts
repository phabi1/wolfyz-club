import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseTaken } from './license-taken';

describe('LicenseTaken', () => {
  let component: LicenseTaken;
  let fixture: ComponentFixture<LicenseTaken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseTaken],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseTaken);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
