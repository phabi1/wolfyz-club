import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentType } from './payment-type';

describe('PaymentType', () => {
  let component: PaymentType;
  let fixture: ComponentFixture<PaymentType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentType],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
