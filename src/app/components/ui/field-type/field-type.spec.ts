import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from './field-type';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('FieldType', () => {
  let component: FieldType;
  let fixture: ComponentFixture<FieldType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldType],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldType);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'text');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
