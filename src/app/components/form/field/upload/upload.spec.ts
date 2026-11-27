import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';

import { UploadFieldType } from './upload';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('UploadFieldType', () => {
  let component: UploadFieldType;
  let fixture: ComponentFixture<UploadFieldType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFieldType],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadFieldType);
    component = fixture.componentInstance;
    component.field = { key: 'upload', formControl: new FormControl(''), props: {} } as FieldTypeConfig<any>;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
