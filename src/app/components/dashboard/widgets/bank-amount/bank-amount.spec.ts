import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAmount } from './bank-amount';

describe('BankAmount', () => {
  let component: BankAmount;
  let fixture: ComponentFixture<BankAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAmount],
    }).compileComponents();

    fixture = TestBed.createComponent(BankAmount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
