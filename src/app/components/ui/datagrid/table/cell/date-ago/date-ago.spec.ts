import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAgo } from './date-ago';

describe('DateAgo', () => {
  let component: DateAgo;
  let fixture: ComponentFixture<DateAgo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateAgo],
    }).compileComponents();

    fixture = TestBed.createComponent(DateAgo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
