import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCompletude } from './lesson-completude';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('LessonCompletude', () => {
  let component: LessonCompletude;
  let fixture: ComponentFixture<LessonCompletude>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonCompletude],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonCompletude);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
