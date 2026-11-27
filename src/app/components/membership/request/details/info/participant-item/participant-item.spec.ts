import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantItem } from './participant-item';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('ParticipantItem', () => {
  let component: ParticipantItem;
  let fixture: ComponentFixture<ParticipantItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantItem],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('participant', { firstname: 'John', lastname: 'Doe', address: { line1: '1 rue de la Paix', line2: '', city: 'Paris', zipcode: '75000', country: 'FR' }, agree_photo: true, agree_exit: false });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
