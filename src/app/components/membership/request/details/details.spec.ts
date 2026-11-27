import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Details } from './details';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('Details', () => {
  let component: Details;
  let fixture: ComponentFixture<Details>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { id: 1, status: 'pending', firstname: 'Jane', lastname: 'Doe', email: 'jane@example.com', phone: '', data: { contact: { firstname: 'Jane', lastname: 'Doe' }, participants: [] }, discount_amount: 0, campaign_id: 1 });
    fixture.componentRef.setInput('lessons', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
