import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Select } from './select';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('Select', () => {
  let component: Select;
  let fixture: ComponentFixture<Select>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Select],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Select);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'select');
    fixture.componentRef.setInput('label', 'Select');
    fixture.componentRef.setInput('values', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
