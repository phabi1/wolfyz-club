import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CampaignService } from '../../../../services/membership/campaign.service';

import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  const campaignServiceMock = {
    item: jasmine.createSpy('item').and.returnValue(
      of({
        id: 1,
        title: 'Campaign test',
        registration_start: null,
        registration_end: null,
        settings: {},
      }),
    ),
    updateSettings: jasmine.createSpy('updateSettings').and.returnValue(of({ success: true })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: CampaignService,
          useValue: campaignServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
