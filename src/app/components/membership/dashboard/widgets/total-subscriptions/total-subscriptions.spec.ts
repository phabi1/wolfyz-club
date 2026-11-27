import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSubscriptions } from './total-subscriptions';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('TotalSubscriptions', () => {
  let component: TotalSubscriptions;
  let fixture: ComponentFixture<TotalSubscriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSubscriptions],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalSubscriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
