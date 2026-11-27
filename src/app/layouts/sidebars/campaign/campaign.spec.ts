import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Campaign } from './campaign';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Campaign', () => {
  let component: Campaign;
  let fixture: ComponentFixture<Campaign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campaign],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Campaign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
