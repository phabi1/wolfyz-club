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
import type { Period } from '../../../models/membership/period';
import { PeriodService } from '../../../services/membership/period.service';

type State = {
  campaign_id: number;
  loading: boolean;
  columns: DatagridColumn[];
  items: Period[];
  page: number;
  size: number;
  total: number;
  filters: any;
  sort: string;
  search: string;
  order: 'asc' | 'desc';
  error: any | null;
};

const initialState: State = {
  campaign_id: 0,
  loading: false,
  columns: [
    { name: 'id', header: 'ID' },
    {
      name: 'title',
      header: 'Titre',
      cell: { type: 'text', options: { featured: true } },
    },
    { name: 'start_date', header: 'Debut', type: 'date' },
    { name: 'end_date', header: 'Fin', type: 'date' },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  filters: {},
  search: '',
  sort: 'start_date,title',
  order: 'asc',
  error: null,
};

export const membershipPeriodListEvents = eventGroup({
  source: 'Membership Period List',
  events: {
    load: type<
      Partial<{
        campaign_id: number;
        page: number;
        size: number;
        sort: string;
        order: 'asc' | 'desc';
        search: string;
      }>
    >(),
    loadSuccess: type<{ items: Period[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
    setPagination: type<Partial<{ page: number; size: number }>>(),
    setSorting: type<Partial<{ sort: string; order: 'asc' | 'desc' }>>(),
    setSearch: type<string>(),
  },
});

export const membershipPeriodList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(membershipPeriodListEvents.load, ({ payload: { campaign_id, ...options } }) => ({
      loading: true,
      campaign_id,
      ...options,
    })),
    on(membershipPeriodListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(membershipPeriodListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipPeriodListEvents.setPagination, ({ payload: { page, size } }) => ({
      page,
      size,
    })),
    on(membershipPeriodListEvents.setSorting, ({ payload: { sort, order } }) => ({
      sort,
      order,
      page: 1,
    })),
    on(membershipPeriodListEvents.setSearch, ({ payload }) => ({
      search: payload,
    })),
  ),
  withEventHandlers((
    store,
    events = inject(Events),
    periodService = inject(PeriodService),
    router = inject(Router),
  ) => ({
    load$: events.on(membershipPeriodListEvents.load).pipe(
      switchMap(() =>
        periodService
          .items(store.campaign_id(), {
            page: store.page(),
            size: store.size(),
            sort: store.sort(),
            order: store.order(),
            search: store.search(),
            fields: ['id', 'title', 'start_date', 'end_date'],
          })
          .pipe(
            mapResponse({
              next: ({ items, total }) => membershipPeriodListEvents.loadSuccess({ items, total }),
              error: (error) => membershipPeriodListEvents.loadFailure({ error }),
            }),
          ),
      ),
    ),
    refreshUrl$: events
      .on(
        membershipPeriodListEvents.setSearch,
        membershipPeriodListEvents.setPagination,
        membershipPeriodListEvents.setSorting,
      )
      .pipe(
        tap(() => {
          const params: any = {};

          params['page'] = store.page();
          params['size'] = store.size();
          params['sort'] = store.sort();
          params['order'] = store.order();
          params['search'] = store.search();

          router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge',
          });
        }),
      ),
    logError$: events.on(membershipPeriodListEvents.loadFailure).pipe(
      tap(({ payload: { error } }) => {
        console.error('Membership period list load error:', error);
      }),
    ),
  })),
  withHooks({
    onInit: (store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = combineLatest([of(2), route.queryParamMap]).subscribe(
        ([campaignId, params]) => {
          const payload: any = {};

          if (params.get('page')) {
            payload['page'] = +(params.get('page') || 1);
          }
          if (params.get('size')) {
            payload['size'] = +(params.get('size') || 10);
          }
          if (params.get('sort')) {
            payload['sort'] = params.get('sort');
          }
          if (params.get('order')) {
            payload['order'] = (params.get('order') as 'asc' | 'desc') || 'asc';
          }
          payload['search'] = params.get('search') || '';

          dispatcher.dispatch(
            membershipPeriodListEvents.load({
              campaign_id: campaignId,
              ...payload,
            }),
          );
        },
      );
      return () => subscription.unsubscribe();
    },
  }),
);
