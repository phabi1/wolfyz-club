import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCapacity } from './lesson-capacity';

describe('LessonCapacity', () => {
  let component: LessonCapacity;
  let fixture: ComponentFixture<LessonCapacity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCapacity],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonCapacity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
