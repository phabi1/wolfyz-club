import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilter } from './date';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('DateFilter', () => {
  let component: DateFilter;
  let fixture: ComponentFixture<DateFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFilter],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'date');
    fixture.componentRef.setInput('label', 'Date');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
