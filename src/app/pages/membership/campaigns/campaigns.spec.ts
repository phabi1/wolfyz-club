import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Campaigns } from './campaigns';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Campaigns', () => {
  let component: Campaigns;
  let fixture: ComponentFixture<Campaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campaigns],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Campaigns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
