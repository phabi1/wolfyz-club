import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Status } from './status';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('Status', () => {
  let component: Status;
  let fixture: ComponentFixture<Status>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Status],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Status);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'pending');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
