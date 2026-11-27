import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRequestStatus } from './total-request-status';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('TotalRequestStatus', () => {
  let component: TotalRequestStatus;
  let fixture: ComponentFixture<TotalRequestStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalRequestStatus],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalRequestStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
