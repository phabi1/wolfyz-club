import { ComponentFixture, TestBed } from '@angular/core/testing';

import { License } from './license';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('License', () => {
  let component: License;
  let fixture: ComponentFixture<License>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [License],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(License);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { id: 1, license_type: 'hobby', license_taken_at: null, doctor: null, medical_certificate: null, medical_certificate_date: null, medical_form: null, identity_photo: null, agree_exit: null, agree_image: false, member_id: 1, member: {}, subscribed_at: new Date(), contacts: [], fields: {}, campaign_id: 1 });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
