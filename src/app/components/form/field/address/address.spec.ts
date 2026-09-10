import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFieldType } from './address';

describe('Address', () => {
  let component: AddressFieldType;
  let fixture: ComponentFixture<AddressFieldType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFieldType],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressFieldType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
