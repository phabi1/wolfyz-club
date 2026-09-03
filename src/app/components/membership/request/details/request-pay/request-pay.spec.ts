import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPay } from './request-pay';

describe('RequestPay', () => {
  let component: RequestPay;
  let fixture: ComponentFixture<RequestPay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPay],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
