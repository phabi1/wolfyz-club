import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withHooks, withState } from '@ngrx/signals';
import {
  Dispatcher,
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { combineLatest, of, switchMap, tap } from 'rxjs';
import type { DatagridColumn } from '../../../components/ui/datagrid/column';
import type { Request } from '../../../models/membership/request';
import { RequestService } from '../../../services/membership/request.service';

type DateRangeFilterValue = {
  from?: string;
  to?: string;
};

type NumberRangeFilterValue = {
  min?: number | string;
  max?: number | string;
};

const DATE_RANGE_FILTER_KEYS = new Set(['created_at']);
const NUMBER_RANGE_FILTER_KEYS = new Set(['id']);

function isDateRangeFilterValue(value: unknown): value is DateRangeFilterValue {
  return typeof value === 'object' && value !== null && ('from' in value || 'to' in value);
}

function isNumberRangeFilterValue(value: unknown): value is NumberRangeFilterValue {
  return typeof value === 'object' && value !== null && ('min' in value || 'max' in value);
}

function toNumber(value: unknown): number | null {
  if (value === '' || value === undefined || value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function serializeFilters(filters: Record<string, any>): string {
  const parts: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (isDateRangeFilterValue(value)) {
      if (value.from) {
        parts.push(`${key}:gte:${value.from}`);
      }
      if (value.to) {
        parts.push(`${key}:lte:${value.to}`);
      }
      return;
    }

    if (isNumberRangeFilterValue(value)) {
      const min = toNumber(value.min);
      const max = toNumber(value.max);
      if (min !== null) {
        parts.push(`${key}:gte:${min}`);
      }
      if (max !== null) {
        parts.push(`${key}:lte:${max}`);
      }
      return;
    }

    if (value !== undefined && value !== null && value !== '') {
      parts.push(`${key}:${value}`);
    }
  });

  return parts.join(';');
}

function parseFilters(rawFilters: string): Record<string, any> {
  return rawFilters
    .split(';')
    .reduce((acc: Record<string, any>, filter: string) => {
      if (!filter) {
        return acc;
      }

      const segments = filter.split(':');

      if (segments.length === 3) {
        const [key, operator, value] = segments;
        if (!key || !operator || !value) {
          return acc;
        }

        if (operator === 'gte' || operator === 'lte') {
          if (DATE_RANGE_FILTER_KEYS.has(key)) {
            const existing = acc[key];
            const range: DateRangeFilterValue =
              isDateRangeFilterValue(existing) && existing ? existing : { from: '', to: '' };
            if (operator === 'gte') {
              range.from = value;
            }
            if (operator === 'lte') {
              range.to = value;
            }
            acc[key] = range;
            return acc;
          }

          if (NUMBER_RANGE_FILTER_KEYS.has(key)) {
            const existing = acc[key];
            const range: NumberRangeFilterValue =
              isNumberRangeFilterValue(existing) && existing ? existing : { min: '', max: '' };
            if (operator === 'gte') {
              range.min = value;
            }
            if (operator === 'lte') {
              range.max = value;
            }
            acc[key] = range;
            return acc;
          }

          acc[key] = value;
          return acc;
        }

        acc[key] = value;
        return acc;
      }

      if (segments.length >= 2) {
        const [key, ...rest] = segments;
        if (key && rest.length > 0) {
          acc[key] = rest.join(':');
        }
      }

      return acc;
    }, {});
}

type State = {
  campaign_id: number;
  loading: boolean;
  columns: DatagridColumn[];
  items: Request[];
  page: number;
  size: number;
  total: number;
  sort: string;
  order: 'asc' | 'desc';
  filters: any;
  search: string;
  error: any | null;
};

const initialState: State = {
  campaign_id: 0,
  loading: false,
  columns: [
    {
      name: 'id',
      header: 'ID',
      filterable: {
        type: 'number',
        options: {},
        row: 1,
      },
    },
    { name: 'firstname', header: 'First Name' },
    { name: 'lastname', header: 'Last Name' },
    { name: 'email', header: 'Email' },
    {
      name: 'status',
      header: 'Status',
      filterable: {
        type: 'select',
        options: {
          values: [
            { label: 'Tous', value: '' },
            { label: 'En attente', value: 'pending' },
            { label: 'Approuvé', value: 'approved' },
            { label: 'Rejeté', value: 'rejected' },
            { label: 'Annulé', value: 'cancelled' },
            { label: 'Payé', value: 'paid' },
          ],
        },
        row: 1,
      },
    },
    {
      name: 'created_at',
      header: 'Created At',
      filterable: {
        type: 'date',
        options: {},
        row: 2,
      },
    },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  sort: 'created_at',
  order: 'desc',
  filters: {},
  search: '',
  error: null,
};

export const membershipRequestListEvents = eventGroup({
  source: 'Membership Request List',
  events: {
    load: type<
      Partial<{ campaign_id: number; page: number; size: number; search: string; filters: any }>
    >(),
    loadSuccess: type<{ items: Request[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
    setPagination: type<Partial<{ page: number; size: number }>>(),
    setSorting: type<Partial<{ sort: string; order: 'asc' | 'desc' }>>(),
    setSearch: type<string>(),
    setFilters: type<any>(),
  },
});

export const membershipRequestList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(
      membershipRequestListEvents.load,
      ({ payload: { campaign_id, page, size, search, filters } }) => ({
        loading: true,
        campaign_id,
        page,
        size,
        search,
        filters,
      }),
    ),
    on(membershipRequestListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(membershipRequestListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipRequestListEvents.setPagination, ({ payload: { page, size } }) => ({
      page,
      size,
    })),
    on(membershipRequestListEvents.setSorting, ({ payload: { sort, order } }) => ({
      sort,
      order,
      page: 1,
    })),
    on(membershipRequestListEvents.setSearch, ({ payload }) => ({
      search: payload,
    })),
    on(membershipRequestListEvents.setFilters, ({ payload }) => ({
      filters: payload,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      router = inject(Router),
      requestService = inject(RequestService),
    ) => ({
      load$: events.on(membershipRequestListEvents.load).pipe(
        switchMap(() => {
          const filters = store.filters();

          const conditions: Record<string, any> = {};
          Object.entries(filters).forEach(([key, value]) => {
            if (isDateRangeFilterValue(value)) {
              const dateConditions: Record<string, string> = {};
              if (value.from) {
                dateConditions['gte'] = value.from;
              }
              if (value.to) {
                dateConditions['lte'] = value.to;
              }
              if (Object.keys(dateConditions).length > 0) {
                conditions[key] = dateConditions;
              }
              return;
            }

            if (isNumberRangeFilterValue(value)) {
              const min = toNumber(value.min);
              const max = toNumber(value.max);
              const numberConditions: Record<string, number> = {};
              if (min !== null) {
                numberConditions['gte'] = min;
              }
              if (max !== null) {
                numberConditions['lte'] = max;
              }
              if (Object.keys(numberConditions).length > 0) {
                conditions[key] = numberConditions;
              }
              return;
            }

            if (value !== undefined && value !== null && value !== '') {
              conditions[key] = { eq: value };
            }
          });

          return requestService
            .items(store.campaign_id(), {
              page: store.page(),
              size: store.size(),
              sort: store.sort(),
              order: store.order(),
              search: store.search(),
              filters: conditions,
            })
            .pipe(
              mapResponse({
                next: ({ items, total }) =>
                  membershipRequestListEvents.loadSuccess({ items, total }),
                error: (error) => membershipRequestListEvents.loadFailure({ error }),
              }),
            );
        }),
      ),
      refreshUrl$: events
        .on(
          membershipRequestListEvents.setSearch,
          membershipRequestListEvents.setPagination,
          membershipRequestListEvents.setSorting,
          membershipRequestListEvents.setFilters,
        )
        .pipe(
          tap(() => {
            const params: any = {};

            const page = store.page();
            const size = store.size();
            const sort = store.sort();
            const order = store.order();
            const search = store.search();
            const filters = store.filters();

            params['page'] = page;
            params['size'] = size;
            params['sort'] = sort;
            params['order'] = order;
            params['search'] = search;

            const serializedFilters = serializeFilters(filters);
            params['filters'] = serializedFilters.length > 0 ? serializedFilters : undefined;

            router.navigate([], {
              queryParams: params,
              queryParamsHandling: 'merge',
            });
          }),
        ),
      logError$: events.on(membershipRequestListEvents.loadFailure).pipe(
        tap(({ payload: { error } }) => {
          console.error('Membership request list load error:', error);
        }),
      ),
    }),
  ),
  withHooks({
    onInit: (store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = combineLatest([of(2), route.queryParamMap]).subscribe(
        ([campaignId, params]) => {
          const page = +(params.get('page') || 1);
          const size = +(params.get('size') || 10);
          const search = params.get('search') || '';
          const filters = parseFilters(params.get('filters') || '');
          dispatcher.dispatch(
            membershipRequestListEvents.load({
              campaign_id: campaignId,
              page,
              size,
              search,
              filters,
            }),
          );
        },
      );
      return () => subscription.unsubscribe();
    },
  }),
);
