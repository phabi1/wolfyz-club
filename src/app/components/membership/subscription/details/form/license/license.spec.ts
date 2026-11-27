import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { License } from './license';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('License', () => {
  let component: License;
  let fixture: ComponentFixture<License>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [License],
      providers: [
        provideTestDefaults(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(License);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
