import { signalStore, type, withHooks, withState } from '@ngrx/signals';
import {
  Dispatcher,
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { Event, createEmptyEvent } from '../../../models/event/event';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { EventService } from '../../../services/event/event.service';
import { mapResponse } from '@ngrx/operators';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

type State = {
  loading: boolean;
  item: Event;
  error: any;
};

export const eventEventDetailsEvents = eventGroup({
  source: 'Event Events Details',
  events: {
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Event }>(),
    loadFailure: type<{ error: any }>(),
  },
});

export const eventEventDetailsStore = signalStore(
  withState<State>({
    loading: false,
    item: createEmptyEvent(),
    error: null,
  }),
  withReducer(
    on(eventEventDetailsEvents.load, () => ({
      loading: true,
      error: null,
    })),
    on(eventEventDetailsEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
    })),
    on(eventEventDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers((store, events = inject(Events), eventService = inject(EventService)) => ({
    load$: events.on(eventEventDetailsEvents.load).pipe(
      switchMap(({ payload: { id } }) =>
        eventService.item(id).pipe(
          mapResponse({
            next: (item) => eventEventDetailsEvents.loadSuccess({ item }),
            error: (error) => eventEventDetailsEvents.loadFailure({ error }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      const subscription = route.params
        .pipe(map((params) => +params['eventId']))
        .subscribe((id) => {
          dispatcher.dispatch(
            eventEventDetailsEvents.load({
              id,
            }),
          );
        });
      return () => subscription.unsubscribe();
    },
  }),
);
