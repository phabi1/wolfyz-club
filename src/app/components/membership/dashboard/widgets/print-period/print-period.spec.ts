import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPeriod } from './print-period';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('PrintPeriod', () => {
  let component: PrintPeriod;
  let fixture: ComponentFixture<PrintPeriod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintPeriod],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintPeriod);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
