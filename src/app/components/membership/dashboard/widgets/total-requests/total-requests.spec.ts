import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRequests } from './total-requests';

describe('TotalSubscriptions', () => {
  let component: TotalRequests;
  let fixture: ComponentFixture<TotalRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
