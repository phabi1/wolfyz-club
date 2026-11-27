import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCapacity } from './lesson-capacity';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('LessonCapacity', () => {
  let component: LessonCapacity;
  let fixture: ComponentFixture<LessonCapacity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCapacity],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonCapacity);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lesson', { id: 1, campaign_id: 1, title: 'Lesson', day: 1, lesson_start: new Date(), lesson_end: new Date(), participant_nb: 1, participant_max: 10 });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
