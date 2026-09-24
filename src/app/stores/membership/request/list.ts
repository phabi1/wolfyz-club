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
    { name: 'id', header: 'ID' },
    { name: 'firstname', header: 'First Name' },
    { name: 'lastname', header: 'Last Name' },
    { name: 'email', header: 'Email' },
    { name: 'status', header: 'Status' },
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
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      router = inject(Router),
      requestService = inject(RequestService),
    ) => ({
      load$: events.on(membershipRequestListEvents.load).pipe(
        switchMap(() =>
          requestService.items(store.campaign_id(), {
              page: store.page(),
              size: store.size(),
              sort: store.sort(),
              order: store.order(),
              search: store.search(),
            }).pipe(
            mapResponse({
              next: ({ items, total }) => membershipRequestListEvents.loadSuccess({ items, total }),
              error: (error) => membershipRequestListEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
      refreshUrl$: events
        .on(
          membershipRequestListEvents.setSearch,
          membershipRequestListEvents.setPagination,
          membershipRequestListEvents.setSorting,
        )
        .pipe(
          tap(() => {
            const params: any = {};

            const page = store.page();
            const size = store.size();
            const sort = store.sort();
            const order = store.order();
            const search = store.search();

            params['page'] = page;
            params['size'] = size;
            params['sort'] = sort;
            params['order'] = order;
            params['search'] = search;

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
          const filters = {};
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
