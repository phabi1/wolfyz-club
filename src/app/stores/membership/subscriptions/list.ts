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
import type { Subscription } from '../../../models/membership/subscription';
import { SubscriptionService } from '../../../services/membership/subscription.service';

type State = {
  campaign_id: number;
  loading: boolean;
  columns: DatagridColumn[];
  items: Subscription[];
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
    { name: 'license', header: 'License', data: 'license_type' },
    {
      name: 'firstname',
      header: 'First Name',
      data: 'member.firstname',
      cell: { type: 'text', options: { featured: true } },
    },
    { name: 'lastname', header: 'Last Name', data: 'member.lastname' },
    { name: 'birthdate', header: 'Birth Date', data: 'member.birthdate', type: 'date' },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  filters: {},
  search: '',
  sort: 'member.lastname,member.firstname',
  order: 'asc',
  error: null,
};

export const membershipSubscriptionListEvents = eventGroup({
  source: 'Membership Request List',
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
    loadSuccess: type<{ items: Subscription[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
    setPagination: type<Partial<{ page: number; size: number }>>(),
    setSorting: type<Partial<{ sort: string; order: 'asc' | 'desc' }>>(),
    setSearch: type<string>(),
  },
});

export const membershipSubscriptionList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(
      membershipSubscriptionListEvents.load,
      ({ payload: { campaign_id, ...options } }) => ({
        loading: true,
        campaign_id,
        ...options,
      }),
    ),
    on(membershipSubscriptionListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(membershipSubscriptionListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipSubscriptionListEvents.setPagination, ({ payload: { page, size } }) => ({
      page,
      size,
    })),
    on(membershipSubscriptionListEvents.setSorting, ({ payload: { sort, order } }) => ({
      sort,
      order,
      page: 1,
    })),
    on(membershipSubscriptionListEvents.setSearch, ({ payload }) => ({
      search: payload,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      subscriptionService = inject(SubscriptionService),
      router = inject(Router),
    ) => ({
      load$: events.on(membershipSubscriptionListEvents.load).pipe(
        switchMap(() =>
          subscriptionService
            .items(store.campaign_id(), {
              page: store.page(),
              size: store.size(),
              sort: store.sort(),
              order: store.order(),
              search: store.search(),
              fields: ['id', 'member', 'license_type']
            })
            .pipe(
              mapResponse({
                next: ({ items, total }) =>
                  membershipSubscriptionListEvents.loadSuccess({ items, total }),
                error: (error) => membershipSubscriptionListEvents.loadFailure({ error }),
              }),
            ),
        ),
      ),
      refreshUrl$: events
        .on(
          membershipSubscriptionListEvents.setSearch,
          membershipSubscriptionListEvents.setPagination,
          membershipSubscriptionListEvents.setSorting,
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
      logError$: events.on(membershipSubscriptionListEvents.loadFailure).pipe(
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
            membershipSubscriptionListEvents.load({
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
