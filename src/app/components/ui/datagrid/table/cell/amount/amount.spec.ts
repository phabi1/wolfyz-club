import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amount } from './amount';

describe('Amount', () => {
  let component: Amount;
  let fixture: ComponentFixture<Amount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Amount],
    }).compileComponents();

    fixture = TestBed.createComponent(Amount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
