import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';

import { PhoneFieldType } from './phone';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('PhoneFieldType', () => {
  let component: PhoneFieldType;
  let fixture: ComponentFixture<PhoneFieldType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneFieldType],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneFieldType);
    component = fixture.componentInstance;
    component.field = { key: 'phone', formControl: new FormControl(''), props: {} } as FieldTypeConfig;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
