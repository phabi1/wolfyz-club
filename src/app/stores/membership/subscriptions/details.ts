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
import { combineLatest, of, switchMap } from 'rxjs';
import type { Subscription } from '../../../models/membership/subscription';
import { SubscriptionService } from '../../../services/membership/subscription.service';

type State = {
  campaignId: number | null;
  id: number | null;
  item: Subscription | null;
  loading: boolean;
  error: any | null;
};

const initialState: State = {
  campaignId: null,
  id: null,
  item: null,
  loading: false,
  error: null,
};

export const membershipSubscriptionDetailsEvents = eventGroup({
  source: 'Membership Subscription Details',
  events: {
    load: type<{ campaignId: number; id: number }>(),
    loadSuccess: type<{ item: Subscription; }>(),
    loadFailure: type<{ error: any }>(),
  },
});

export const membershipSubscriptionDetails = signalStore(
  withState(initialState),
  withReducer(
    on(membershipSubscriptionDetailsEvents.load, ({ payload: { campaignId, id } }) => ({
      loading: true,
      campaignId,
      id,
      error: null,
    })),
    on(
      membershipSubscriptionDetailsEvents.loadSuccess,
      ({ payload: { item } }) => ({
        loading: false,
        item,
      }),
    ),
    on(membershipSubscriptionDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers((state, events = inject(Events), subscriptionService = inject(SubscriptionService)) => ({
    load$: events.on(membershipSubscriptionDetailsEvents.load).pipe(
      switchMap(({ payload: { campaignId, id } }) =>
        subscriptionService.item(campaignId, +id).pipe(
          mapResponse({
            next: (item) =>
              membershipSubscriptionDetailsEvents.loadSuccess({ item }),
            error: (error) => membershipSubscriptionDetailsEvents.loadFailure({ error }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      const subscription = combineLatest([of(2), route.params]).subscribe(([value, params]) => {
        dispatcher.dispatch(
          membershipSubscriptionDetailsEvents.load({
            campaignId: value,
            id: params['requestId'],
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
