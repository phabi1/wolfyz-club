import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Participants } from './participants';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('Participants', () => {
  let component: Participants;
  let fixture: ComponentFixture<Participants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Participants],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Participants);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('participants', []);
    fixture.componentRef.setInput('lessons', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
