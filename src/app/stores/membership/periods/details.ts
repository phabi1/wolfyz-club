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
import type { Period } from '../../../models/membership/period';
import { PeriodService } from '../../../services/membership/period.service';

type State = {
  campaignId: number | null;
  id: number | null;
  item: Period | null;
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

export const membershipPeriodDetailsEvents = eventGroup({
  source: 'Membership Period Details',
  events: {
    init: type<{ campaignId: number }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Period }>(),
    loadFailure: type<{ error: any }>(),
  },
});

export const membershipPeriodDetails = signalStore(
  withState(initialState),
  withReducer(
    on(membershipPeriodDetailsEvents.init, ({ payload: { campaignId } }) => ({
      campaignId,
    })),
    on(membershipPeriodDetailsEvents.load, ({ payload: { id } }) => ({
      loading: true,
      id,
      error: null,
    })),
    on(membershipPeriodDetailsEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
    })),
    on(membershipPeriodDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers((
    state,
    events = inject(Events),
    periodService = inject(PeriodService),
  ) => ({
    load$: events.on(membershipPeriodDetailsEvents.load).pipe(
      switchMap(({ payload: { id } }) =>
        periodService.item(state.campaignId() || 0, id).pipe(
          mapResponse({
            next: (item) => membershipPeriodDetailsEvents.loadSuccess({ item }),
            error: (error) => membershipPeriodDetailsEvents.loadFailure({ error }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      dispatcher.dispatch(
        membershipPeriodDetailsEvents.init({
          campaignId: 2,
        }),
      );

      const subscription = combineLatest([of(2), route.params]).subscribe(([, params]) => {
        dispatcher.dispatch(
          membershipPeriodDetailsEvents.load({
            id: +(params['periodId'] || 0),
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
