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
import { ParticipantService } from '../../../services/event/participant.service';

type State = {
  loading: boolean;
  item: Event;
  error: any;
  tickets: { id: number; title: string; participant_nb: number; participant_max: number }[];
  participants: any[];
  totalParticipants: number;
};

export const eventEventDetailsEvents = eventGroup({
  source: 'Event Events Details',
  events: {
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Event }>(),
    loadFailure: type<{ error: any }>(),
    loadParticipants: type<void>(),
    loadParticipantsSuccess: type<{ items: any[]; total: number }>(),
    loadParticipantsFailure: type<{ error: any }>(),
  },
});

export const eventEventDetailsStore = signalStore(
  withState<State>({
    loading: false,
    item: createEmptyEvent(),
    error: null,
    tickets: [],
    participants: [],
    totalParticipants: 0,
  }),
  withReducer(
    on(eventEventDetailsEvents.load, () => ({
      loading: true,
      error: null,
    })),
    on(eventEventDetailsEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
      tickets: item.tickets || [],
    })),
    on(eventEventDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(eventEventDetailsEvents.loadParticipants, () => ({
      loading: true,
      error: null,
    })),
    on(eventEventDetailsEvents.loadParticipantsSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      participants: items,
      totalParticipants: total,
    })),
    on(eventEventDetailsEvents.loadParticipantsFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      eventService = inject(EventService),
      participantService = inject(ParticipantService),
    ) => ({
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
      loadSuccess$: events
        .on(eventEventDetailsEvents.loadSuccess)
        .pipe(map(() => eventEventDetailsEvents.loadParticipants())),
      loadParticipants$: events.on(eventEventDetailsEvents.loadParticipants).pipe(
        switchMap(() =>
          participantService.items(store.item().id, { size: 200 }).pipe(
            mapResponse({
              next: (res) =>
                eventEventDetailsEvents.loadParticipantsSuccess({
                  items: res.items,
                  total: res.total,
                }),
              error: (error) => eventEventDetailsEvents.loadParticipantsFailure({ error }),
            }),
          ),
        ),
      ),
    }),
  ),
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
