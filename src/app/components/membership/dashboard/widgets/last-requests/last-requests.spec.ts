import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRequests } from './last-requests';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('LastRequests', () => {
  let component: LastRequests;
  let fixture: ComponentFixture<LastRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastRequests],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(LastRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
