import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantItem } from './participant-item';

describe('ParticipantItem', () => {
  let component: ParticipantItem;
  let fixture: ComponentFixture<ParticipantItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
