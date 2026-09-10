import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Phone } from './phone';

describe('Phone', () => {
  let component: Phone;
  let fixture: ComponentFixture<Phone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Phone],
    }).compileComponents();

    fixture = TestBed.createComponent(Phone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
