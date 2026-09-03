import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusSwitcher } from './status-switcher';

describe('StatusSwitcher', () => {
  let component: StatusSwitcher;
  let fixture: ComponentFixture<StatusSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusSwitcher],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
