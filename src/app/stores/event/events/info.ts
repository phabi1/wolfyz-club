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
import { combineLatest, forkJoin, map, switchMap } from 'rxjs';
import type { ParticipantField } from '../../../models/event/participant-field';
import { ParticipantFieldService } from '../../../services/event/participant-field.service';
import { ParticipantService } from '../../../services/event/participant.service';

export type EventParticipant = {
  id: number;
  firstname?: string;
  lastname?: string;
  fields?: Record<string, unknown>;
  ticket?: {
    id?: number;
    title?: string;
  };
  checkout?: {
    status?: string;
    created_at?: string;
  };
  payer?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
  };
};

type State = {
  loading: boolean;
  item: EventParticipant | null;
  fields: ParticipantField[];
  error: unknown;
};

export const eventEventInfoEvents = eventGroup({
  source: 'Event Events Info',
  events: {
    load: type<{ eventId: number; participantId: number }>(),
    loadSuccess: type<{ item: EventParticipant; fields: ParticipantField[] }>(),
    loadFailure: type<{ error: unknown }>(),
  },
});

export const eventEventInfoStore = signalStore(
  withState<State>({
    loading: false,
    item: null,
    fields: [],
    error: null,
  }),
  withReducer(
    on(eventEventInfoEvents.load, () => ({
      loading: true,
      error: null,
    })),
    on(eventEventInfoEvents.loadSuccess, ({ payload: { item, fields } }) => ({
      loading: false,
      item,
      fields,
    })),
    on(eventEventInfoEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers(
    (
      _,
      events = inject(Events),
      participantService = inject(ParticipantService),
      participantFieldService = inject(ParticipantFieldService),
    ) => ({
      load$: events.on(eventEventInfoEvents.load).pipe(
        switchMap(({ payload: { eventId, participantId } }) =>
          forkJoin({
            item: participantService.item(eventId, participantId),
            fieldsResponse: participantFieldService.items(eventId, { size: 200 }),
          }).pipe(
            mapResponse({
              next: ({ item, fieldsResponse }) =>
                eventEventInfoEvents.loadSuccess({
                  item: item as EventParticipant,
                  fields: fieldsResponse.items,
                }),
              error: (error) => eventEventInfoEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(_, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      const subscription = combineLatest([
        route.parent
          ? route.parent.params.pipe(map((params) => Number(params['eventId'])))
          : route.params.pipe(map((params) => Number(params['eventId']))),
        route.params.pipe(map((params) => Number(params['participantId']))),
      ]).subscribe(([eventId, participantId]) => {
        if (!Number.isNaN(eventId) && !Number.isNaN(participantId)) {
          dispatcher.dispatch(eventEventInfoEvents.load({ eventId, participantId }));
        }
      });

      return () => subscription.unsubscribe();
    },
  }),
);
