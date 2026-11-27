import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPay } from './request-pay';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('RequestPay', () => {
  let component: RequestPay;
  let fixture: ComponentFixture<RequestPay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPay],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPay);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'pending');
    fixture.componentRef.setInput('pay', { total_amount: 0, currency: 'EUR', pricing_breakdown: [] });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
