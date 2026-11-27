import { ComponentFixture, TestBed } from '@angular/core/testing';

import { New } from './new';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('New', () => {
  let component: New;
  let fixture: ComponentFixture<New>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [New],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(New);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
