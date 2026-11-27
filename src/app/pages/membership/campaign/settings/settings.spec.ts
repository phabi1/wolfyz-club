import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldToggle } from '@ngx-formly/material/toggle';
import { of } from 'rxjs';
import { Collection } from '../../../../components/form/field/collection/collection';
import { TabsFieldType } from '../../../../components/ui/formly/fields/tabs/tabs-field';
import { CampaignService } from '../../../../services/membership/campaign.service';

import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  const campaignServiceMock = {
    item: vi.fn().mockReturnValue(
      of({
        id: 1,
        title: 'Campaign test',
        registration_start: null,
        registration_end: null,
        settings: {},
      }),
    ),
    update: vi.fn().mockReturnValue(of({})),
    updateSettings: vi.fn().mockReturnValue(of({ success: true })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        provideFormlyCore([
          ...withFormlyMaterial(),
          withFormlyFieldToggle(),
          {
            types: [
              { name: 'tabs', component: TabsFieldType },
              { name: 'collection', component: Collection },
            ],
          },
        ]),
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

  it('should always expose a custom fields editor', () => {
    expect(component.store.fieldKinds()['participant_fields']).toBe('custom');
    expect(component.store.model()['participant_fields']).toEqual([]);
  });

  it('should save normalized custom fields', async () => {
    const model = component.store.model() as Record<string, unknown>;
    (model['participant_fields'] as unknown[]).push({
      id: 'new-123',
      label: 'Taille de maillot',
      type: 'options',
      options: 'S, M, L',
      required: true,
    });

    component.onSubmit();
    await fixture.whenStable();

    expect(campaignServiceMock.updateSettings).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        participant_fields: [
          {
            name: 'taille_de_maillot',
            label: 'Taille de maillot',
            type: 'options',
            required: true,
            options: 'S, M, L',
          },
        ],
      }),
    );
  });
});
