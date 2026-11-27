import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFilter } from './number';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('NumberFilter', () => {
  let component: NumberFilter;
  let fixture: ComponentFixture<NumberFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFilter],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberFilter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'number');
    fixture.componentRef.setInput('label', 'Number');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
