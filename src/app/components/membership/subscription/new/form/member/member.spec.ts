import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Member } from './member';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('Member', () => {
  let component: Member;
  let fixture: ComponentFixture<Member>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Member],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Member);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
