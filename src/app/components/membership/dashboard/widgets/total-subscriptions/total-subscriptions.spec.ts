import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSubscriptions } from './total-subscriptions';

describe('TotalSubscriptions', () => {
  let component: TotalSubscriptions;
  let fixture: ComponentFixture<TotalSubscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSubscriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalSubscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
