import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LicenseTaken } from './license-taken';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('LicenseTaken', () => {
  let component: LicenseTaken;
  let fixture: ComponentFixture<LicenseTaken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseTaken],
      providers: [
        provideTestDefaults(),
        { provide: MAT_DIALOG_DATA, useValue: { campaignId: '1', ids: [1, 2], reverse: false } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseTaken);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
