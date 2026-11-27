import { ComponentFixture, TestBed } from '@angular/core/testing';
import { membershipRequestDetails } from '../../../../../stores/membership/request/details';

import { StatusSwitcher } from './status-switcher';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('StatusSwitcher', () => {
  let component: StatusSwitcher;
  let fixture: ComponentFixture<StatusSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSwitcher],
      providers: [provideTestDefaults(), membershipRequestDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
