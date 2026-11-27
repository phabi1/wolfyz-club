import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPeriods } from './total-periods';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('TotalPeriods', () => {
  let component: TotalPeriods;
  let fixture: ComponentFixture<TotalPeriods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPeriods],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalPeriods);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
