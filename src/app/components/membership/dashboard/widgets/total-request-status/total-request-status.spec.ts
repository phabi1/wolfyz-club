import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRequestStatus } from './total-request-status';

describe('TotalRequestStatus', () => {
  let component: TotalRequestStatus;
  let fixture: ComponentFixture<TotalRequestStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalRequestStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalRequestStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
