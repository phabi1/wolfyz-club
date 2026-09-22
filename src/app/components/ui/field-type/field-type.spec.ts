import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldType } from './field-type';

describe('FieldType', () => {
  let component: FieldType;
  let fixture: ComponentFixture<FieldType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldType],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
