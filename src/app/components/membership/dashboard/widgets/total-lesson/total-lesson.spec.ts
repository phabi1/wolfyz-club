import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalLesson } from './total-lesson';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('TotalLesson', () => {
  let component: TotalLesson;
  let fixture: ComponentFixture<TotalLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalLesson],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalLesson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
