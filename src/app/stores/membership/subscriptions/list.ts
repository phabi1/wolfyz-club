import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  filters: {},
  error: null,
};

export const membershipSubscriptiontListEvents = eventGroup({
  source: 'Membership Request List',
  events: {
    load: type<Partial<{ campaign_id: number; page: number; size: number }>>(),
    loadSuccess: type<{ items: Subscription[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
  },
});

export const membershipSubscriptionList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(membershipSubscriptiontListEvents.load, ({ payload: { campaign_id } }) => ({
      loading: true,
      campaign_id,
    })),
  ),
  withReducer(
    on(membershipSubscriptiontListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
  ),
  withReducer(
    on(membershipSubscriptiontListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      subscriptionService = inject(SubscriptionService),
    ) => ({
      load$: events.on(membershipSubscriptiontListEvents.load).pipe(
        switchMap(() =>
          subscriptionService.items(store.campaign_id()).pipe(
            mapResponse({
              next: ({ items, total }) => membershipSubscriptiontListEvents.loadSuccess({ items, total }),
              error: (error) => membershipSubscriptiontListEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
      logError$: events.on(membershipSubscriptiontListEvents.loadFailure).pipe(
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
          dispatcher.dispatch(
            membershipSubscriptiontListEvents.load({ campaign_id: campaignId, page, size }),
          );
        },
      );
      return () => subscription.unsubscribe();
    },
  }),
);
