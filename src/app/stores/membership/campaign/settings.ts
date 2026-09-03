import { inject } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withState } from '@ngrx/signals';
import {
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { forkJoin, of, switchMap } from 'rxjs';
import type { Campaign } from '../../../models/membership/campaign';
import { CampaignService } from '../../../services/membership/campaign.service';

const CAMPAIGN_TITLE_KEY = '__campaign_title';
const CAMPAIGN_START_DATE_KEY = '__campaign_start_date';
const CAMPAIGN_END_DATE_KEY = '__campaign_end_date';
const CAMPAIGN_REGISTRATION_START_KEY = '__campaign_registration_start';
const CAMPAIGN_REGISTRATION_END_KEY = '__campaign_registration_end';

type FieldKind = 'string' | 'number' | 'boolean' | 'json' | 'custom';

type State = {
  loading: boolean;
  saving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  campaign: Campaign | null;
  model: Record<string, unknown>;
  fields: FormlyFieldConfig[];
  fieldKinds: Record<string, FieldKind>;
};

const initialState: State = {
  loading: false,
  saving: false,
  errorMessage: null,
  successMessage: null,
  campaign: null,
  model: {},
  fields: [],
  fieldKinds: {},
};

export const membershipCampaignSettingsEvents = eventGroup({
  source: 'Membership Campaign Settings',
  events: {
    load: type<{ campaignId: string }>(),
    loadSuccess: type<{
      campaign: Campaign;
      model: Record<string, unknown>;
      fields: FormlyFieldConfig[];
      fieldKinds: Record<string, FieldKind>;
    }>(),
    loadFailure: type<{ errorMessage: string }>(),
    save: type<void>(),
    saveSuccess: type<{
      campaign: Campaign;
      model: Record<string, unknown>;
      fields: FormlyFieldConfig[];
      fieldKinds: Record<string, FieldKind>;
    }>(),
    saveFailure: type<{ errorMessage: string }>(),
    setValidationError: type<{ errorMessage: string }>(),
  },
});

export const membershipCampaignSettings = signalStore(
  withState(initialState),
  withReducer(
    on(membershipCampaignSettingsEvents.load, () => ({
      loading: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(membershipCampaignSettingsEvents.loadSuccess, ({ payload }) => ({
      loading: false,
      campaign: payload.campaign,
      model: payload.model,
      fields: payload.fields,
      fieldKinds: payload.fieldKinds,
      errorMessage: null,
      successMessage: null,
    })),
    on(membershipCampaignSettingsEvents.loadFailure, ({ payload }) => ({
      loading: false,
      errorMessage: payload.errorMessage,
      successMessage: null,
    })),
    on(membershipCampaignSettingsEvents.save, () => ({
      saving: true,
      errorMessage: null,
      successMessage: null,
    })),
    on(membershipCampaignSettingsEvents.saveSuccess, ({ payload }) => ({
      saving: false,
      campaign: payload.campaign,
      model: payload.model,
      fields: payload.fields,
      fieldKinds: payload.fieldKinds,
      errorMessage: null,
      successMessage: 'Campaign settings saved.',
    })),
    on(membershipCampaignSettingsEvents.saveFailure, ({ payload }) => ({
      saving: false,
      errorMessage: payload.errorMessage,
      successMessage: null,
    })),
    on(membershipCampaignSettingsEvents.setValidationError, ({ payload }) => ({
      errorMessage: payload.errorMessage,
      successMessage: null,
    })),
  ),
  withEventHandlers(
    (state, events = inject(Events), campaignService = inject(CampaignService)) => ({
      load$: events.on(membershipCampaignSettingsEvents.load).pipe(
        switchMap(({ payload: { campaignId } }) =>
          campaignService.item(campaignId).pipe(
            mapResponse({
              next: (campaign) => {
                const formConfig = buildFormConfig(campaign);
                return membershipCampaignSettingsEvents.loadSuccess({
                  campaign,
                  model: formConfig.model,
                  fields: formConfig.fields,
                  fieldKinds: formConfig.fieldKinds,
                });
              },
              error: () =>
                membershipCampaignSettingsEvents.loadFailure({
                  errorMessage: 'Unable to load campaign settings.',
                }),
            }),
          ),
        ),
      ),
      save$: events.on(membershipCampaignSettingsEvents.save).pipe(
        switchMap(() => {
          const currentCampaign = state.campaign();
          if (!currentCampaign) {
            return of(
              membershipCampaignSettingsEvents.saveFailure({
                errorMessage: 'Missing campaign data.',
              }),
            );
          }

          const settingsResult = toSettingsPayload(state.model(), state.fieldKinds());
          if ('errorMessage' in settingsResult) {
            return of(
              membershipCampaignSettingsEvents.saveFailure({
                errorMessage: settingsResult.errorMessage,
              }),
            );
          }

          const campaignResult = toCampaignPayload(state.model());
          if ('errorMessage' in campaignResult) {
            return of(
              membershipCampaignSettingsEvents.saveFailure({
                errorMessage: campaignResult.errorMessage,
              }),
            );
          }

          return forkJoin([
            campaignService.update(currentCampaign.id, campaignResult.payload),
            campaignService.updateSettings(currentCampaign.id, settingsResult.payload),
          ]).pipe(
            mapResponse({
              next: ([updatedCampaign]) => {
                const nextCampaign: Campaign = {
                  ...currentCampaign,
                  ...campaignResult.payload,
                  ...updatedCampaign,
                  settings: settingsResult.payload,
                };

                const formConfig = buildFormConfig(nextCampaign);
                return membershipCampaignSettingsEvents.saveSuccess({
                  campaign: nextCampaign,
                  model: formConfig.model,
                  fields: formConfig.fields,
                  fieldKinds: formConfig.fieldKinds,
                });
              },
              error: () =>
                membershipCampaignSettingsEvents.saveFailure({
                  errorMessage: 'Unable to save campaign settings.',
                }),
            }),
          );
        }),
      ),
    }),
  ),
);

function buildFormConfig(campaign: Campaign): {
  model: Record<string, unknown>;
  fields: FormlyFieldConfig[];
  fieldKinds: Record<string, FieldKind>;
} {
  const fieldsConfig = toFormlyFields(campaign.settings ?? {});
  return {
    model: toFormModel(campaign),
    fields: fieldsConfig.fields,
    fieldKinds: fieldsConfig.fieldKinds,
  };
}

function toFormlyFields(settings: Record<string, unknown>): {
  fields: FormlyFieldConfig[];
  fieldKinds: Record<string, FieldKind>;
} {
  const generalFields: FormlyFieldConfig[] = [
    {
      key: CAMPAIGN_TITLE_KEY,
      type: 'input',
      props: {
        label: 'Title',
        required: true,
      },
      validators: {
        validation: [Validators.required],
      },
    },
    {
      key: CAMPAIGN_START_DATE_KEY,
      type: 'input',
      props: {
        label: 'Start date',
        type: 'date',
      },
    },
    {
      key: CAMPAIGN_END_DATE_KEY,
      type: 'input',
      props: {
        label: 'End date',
        type: 'date',
      },
    },
    {
      key: CAMPAIGN_REGISTRATION_START_KEY,
      type: 'input',
      props: {
        label: 'Registration start',
        type: 'date',
      },
    },
    {
      key: CAMPAIGN_REGISTRATION_END_KEY,
      type: 'input',
      props: {
        label: 'Registration end',
        type: 'date',
      },
    },
  ];
  const licensesFields: FormlyFieldConfig[] = [];
  const paymentFields: FormlyFieldConfig[] = [];
  const fieldKinds: Record<string, FieldKind> = {};

  for (const key of Object.keys(settings)) {
    const value = settings[key];
    const label = humanizeKey(key);

    if (key === 'licenses' && Array.isArray(value)) {
      fieldKinds[key] = 'custom';
      licensesFields.push({
        key,
        type: 'licenses',
        props: {
          label,
        },
      });
      continue;
    }

    if (key === 'payment_methods' && Array.isArray(value)) {
      fieldKinds[key] = 'custom';
      paymentFields.push({
        key,
        type: 'payment-methods',
        props: {
          label,
        },
      });
      continue;
    }

    if (typeof value === 'boolean') {
      fieldKinds[key] = 'boolean';
      generalFields.push({
        key,
        type: 'checkbox',
        props: {
          label,
        },
      });
      continue;
    }

    if (typeof value === 'number') {
      fieldKinds[key] = 'number';
      generalFields.push({
        key,
        type: 'input',
        props: {
          label,
          type: 'number',
        },
      });
      continue;
    }

    if (typeof value === 'string') {
      fieldKinds[key] = 'string';
      generalFields.push({
        key,
        type: 'input',
        props: {
          label,
        },
      });
      continue;
    }

    fieldKinds[key] = 'json';
    generalFields.push({
      key,
      type: 'textarea',
      props: {
        label,
        rows: 6,
        description: 'JSON value',
      },
      validators: {
        validJson: {
          expression: (control: AbstractControl) => {
            const raw = String(control.value ?? '').trim();
            if (!raw) {
              return true;
            }

            try {
              JSON.parse(raw);
              return true;
            } catch {
              return false;
            }
          },
          message: () => 'Invalid JSON value.',
        },
      },
    });
  }

  const tabs = [
    {
      props: { label: 'General' },
      fieldGroup: generalFields,
    },
    {
      props: { label: 'Licenses' },
      fieldGroup: licensesFields,
    },
    {
      props: { label: 'Payment methods' },
      fieldGroup: paymentFields,
    },
  ].filter((tab) => tab.fieldGroup.length > 0);

  if (!tabs.length) {
    return { fields: [], fieldKinds };
  }

  return {
    fields: [
      {
        type: 'tabs',
        fieldGroup: tabs,
      },
    ],
    fieldKinds,
  };
}

function toFormModel(campaign: Campaign): Record<string, unknown> {
  const model: Record<string, unknown> = {};

  model[CAMPAIGN_TITLE_KEY] = campaign.title ?? '';
  model[CAMPAIGN_START_DATE_KEY] = toDateInputValue(campaign.start_date ?? null);
  model[CAMPAIGN_END_DATE_KEY] = toDateInputValue(campaign.end_date ?? null);
  model[CAMPAIGN_REGISTRATION_START_KEY] = toDateInputValue(campaign.registration_start ?? null);
  model[CAMPAIGN_REGISTRATION_END_KEY] = toDateInputValue(campaign.registration_end ?? null);

  const settings = campaign.settings ?? {};
  for (const key of Object.keys(settings)) {
    const value = settings[key];
    if (value !== null && typeof value === 'object') {
      model[key] = JSON.stringify(value, null, 2);
    } else {
      model[key] = value;
    }
  }

  return model;
}

function toCampaignPayload(
  model: Record<string, unknown>,
): { payload: Partial<Campaign> } | { errorMessage: string } {
  const title = String(model[CAMPAIGN_TITLE_KEY] ?? '').trim();
  if (!title) {
    return { errorMessage: 'Campaign title is required.' };
  }

  const startDate = fromDateInputValue(model[CAMPAIGN_START_DATE_KEY], 'start date');
  if (startDate === undefined) {
    return { errorMessage: 'Invalid start date.' };
  }

  const endDate = fromDateInputValue(model[CAMPAIGN_END_DATE_KEY], 'end date');
  if (endDate === undefined) {
    return { errorMessage: 'Invalid end date.' };
  }

  const registrationStart = fromDateInputValue(
    model[CAMPAIGN_REGISTRATION_START_KEY],
    'registration start date',
  );
  if (registrationStart === undefined) {
    return { errorMessage: 'Invalid registration start date.' };
  }

  const registrationEnd = fromDateInputValue(
    model[CAMPAIGN_REGISTRATION_END_KEY],
    'registration end date',
  );
  if (registrationEnd === undefined) {
    return { errorMessage: 'Invalid registration end date.' };
  }

  return {
    payload: {
      title,
      start_date: startDate,
      end_date: endDate,
      registration_start: registrationStart,
      registration_end: registrationEnd,
    },
  };
}

function toSettingsPayload(
  model: Record<string, unknown>,
  fieldKinds: Record<string, FieldKind>,
): { payload: Record<string, unknown> } | { errorMessage: string } {
  const payload: Record<string, unknown> = {};

  for (const key of Object.keys(fieldKinds)) {
    const kind = fieldKinds[key];
    const value = model[key];

    if (kind === 'json') {
      const raw = String(value ?? '').trim();
      if (!raw) {
        payload[key] = null;
        continue;
      }

      try {
        payload[key] = JSON.parse(raw);
      } catch {
        return { errorMessage: `Invalid JSON for ${key}.` };
      }
      continue;
    }

    if (kind === 'number') {
      if (typeof value === 'number') {
        payload[key] = value;
      } else {
        const parsed = Number(value);
        payload[key] = Number.isNaN(parsed) ? 0 : parsed;
      }
      continue;
    }

    if (kind === 'boolean') {
      payload[key] = Boolean(value);
      continue;
    }

    if (kind === 'custom') {
      payload[key] = value;
      continue;
    }

    payload[key] = value == null ? '' : String(value);
  }

  return { payload };
}

function humanizeKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toDateInputValue(value: unknown): string {
  if (!value) {
    return '';
  }

  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function fromDateInputValue(value: unknown, _label: string): Date | null | undefined {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return null;
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}
