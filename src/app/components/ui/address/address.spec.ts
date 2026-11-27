import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Address } from './address';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Address', () => {
  let component: Address;
  let fixture: ComponentFixture<Address>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Address],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Address);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('address', { line1: '1 rue de la Paix', line2: '', city: 'Paris', zipcode: '75000', country: 'FR' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
