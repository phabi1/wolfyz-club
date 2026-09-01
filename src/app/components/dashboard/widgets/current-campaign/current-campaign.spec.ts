import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCampaign } from './current-campaign';

describe('CurrentCampaign', () => {
  let component: CurrentCampaign;
  let fixture: ComponentFixture<CurrentCampaign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentCampaign],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentCampaign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
