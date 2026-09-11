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
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import type { Event } from '../../../models/event/event';
import type { Session } from '../../../models/event/session';
import type { Ticket } from '../../../models/event/ticket';
import type { ParticipantField } from '../../../models/event/participant-field';
import { EventService } from '../../../services/event/event.service';
import { SessionService } from '../../../services/event/session.service';
import { TicketService } from '../../../services/event/ticket.service';
import { ParticipantFieldService } from '../../../services/event/participant-field.service';

type State = {
  loading: boolean;
  saving: boolean;
  item: Event;
  error: any;
};

export const eventEventConfigureEvents = eventGroup({
  source: 'Event Events Configure',
  events: {
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Event }>(),
    loadFailure: type<{ error: any }>(),
    save: type<{ data: Partial<Omit<Event, 'id' | 'participant_nb'>> }>(),
    saveSuccess: type<{ item: Event }>(),
    saveFailure: type<{ error: any }>(),
  },
});

export const eventEventConfigureStore = signalStore(
  withState<State>({
    loading: false,
    saving: false,
    item: {} as Event,
    error: null,
  }),
  withReducer(
    on(eventEventConfigureEvents.load, () => ({
      loading: true,
      error: null,
    })),
    on(eventEventConfigureEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
    })),
    on(eventEventConfigureEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(eventEventConfigureEvents.save, () => ({
      saving: true,
      error: null,
    })),
    on(eventEventConfigureEvents.saveSuccess, ({ payload: { item } }) => ({
      saving: false,
      item,
    })),
    on(eventEventConfigureEvents.saveFailure, ({ payload: { error } }) => ({
      saving: false,
      error,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      eventService = inject(EventService),
      sessionService = inject(SessionService),
      ticketService = inject(TicketService),
      participantFieldService = inject(ParticipantFieldService),
    ) => ({
      load$: events.on(eventEventConfigureEvents.load).pipe(
        switchMap(({ payload: { id } }) =>
          eventService.item(id).pipe(
            mapResponse({
              next: (item) => eventEventConfigureEvents.loadSuccess({ item }),
              error: (error) => eventEventConfigureEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
      save$: events.on(eventEventConfigureEvents.save).pipe(
        switchMap(({ payload: { data } }) => {
          const actions = [];

          const { sessions, tickets, participant_fields, ...eventData } = data;

          actions.push(
            eventService.update(store.item().id, eventData).pipe(
              mapResponse({
                next: (item) => eventEventConfigureEvents.saveSuccess({ item }),
                error: (error) => eventEventConfigureEvents.saveFailure({ error }),
              }),
            ),
          );

          if (Array.isArray(sessions)) {
            actions.push(
              syncSessions({
                eventId: store.item().id,
                sessions: sessions,
                current: store.item().sessions || [],
                sessionService,
              }),
            );
          }

          if (Array.isArray(tickets)) {
            actions.push(
              syncTickets({
                eventId: store.item().id,
                tickets: tickets,
                current: store.item().tickets || [],
                ticketService,
              }),
            );
          }

          if (Array.isArray(participant_fields)) {
            actions.push(
              syncParticipantFields({
                eventId: store.item().id,
                participantFields: participant_fields,
                current: store.item().participant_fields || [],
                participantFieldService,
              }),
            );
          }

          return forkJoin(actions);
        }),
      ),
    }),
  ),
  withHooks({
    onInit: (store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = route.params
        .pipe(map((params) => +params['eventId']))
        .subscribe((id) => {
          dispatcher.dispatch(eventEventConfigureEvents.load({ id }));
        });
      return () => subscription.unsubscribe();
    },
  }),
);

function syncSessions(params: {
  eventId: number;
  sessions: Partial<Session>[];
  current: Partial<Session>[];
  sessionService: SessionService;
}): Observable<unknown[]> {
  const { eventId, sessions, current, sessionService } = params;

  const requestedExistingIds = new Set(
    sessions.filter((session) => Number(session.id) > 0).map((session) => Number(session.id)),
  );

  const toDelete = current.filter((session) => !requestedExistingIds.has(Number(session.id)));
  const toCreate = sessions.filter((session) => session.id === undefined || Number(session.id) <= 0);

  const operations: Observable<unknown>[] = [];

  for (const session of toCreate) {
    operations.push(
      sessionService.create(eventId, {
        session_start: session.session_start,
        session_end: session.session_end,
        event_id: eventId,
      } as any),
    );
  }

  for (const session of toDelete) {
    operations.push(sessionService.delete(eventId, Number(session.id)));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations);
}

export function syncTickets(params: {
  eventId: number;
  tickets: Partial<Ticket>[];
  current: Partial<Ticket>[];
  ticketService: TicketService;
}): Observable<unknown[]> {
  const { eventId, tickets, current, ticketService } = params;

  const requestedExistingIds = new Set(
    tickets.filter((ticket) => Number(ticket.id) > 0).map((ticket) => Number(ticket.id)),
  );

  const toDelete = current.filter((ticket) => !requestedExistingIds.has(Number(ticket.id)));
  const toCreate = tickets.filter((ticket) => ticket.id === undefined || Number(ticket.id) <= 0);

  const operations: Observable<unknown>[] = [];

  for (const ticket of toCreate) {
    operations.push(
      ticketService.create(eventId, {
        title: ticket.title || '',
        amount: ticket.amount,
        quantity: ticket.quantity,
        member_only: ticket.member_only,
        event_id: eventId,
      } as any),
    );
  }

  for (const ticket of toDelete) {
    operations.push(ticketService.delete(eventId, Number(ticket.id)));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations);
}

export function syncParticipantFields(params: {
  eventId: number;
  participantFields: Partial<ParticipantField>[];
  current: Partial<ParticipantField>[];
  participantFieldService: ParticipantFieldService;
}): Observable<unknown[]> {
  const { eventId, participantFields, current, participantFieldService } = params;

  const requestedExistingIds = new Set(
    participantFields.filter((field) => Number(field.id) > 0).map((field) => Number(field.id)),
  );

  const toDelete = current.filter((field) => !requestedExistingIds.has(Number(field.id)));
  const toCreate = participantFields.filter((field) => field.id === undefined || Number(field.id) <= 0);

  const operations: Observable<unknown>[] = [];

  for (const field of toCreate) {
    operations.push(
      participantFieldService.create(eventId, {
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
        description: field.description,
        tickets: field.tickets,
        event_id: eventId,
      } as any),
    );
  }

  for (const field of toDelete) {
    operations.push(participantFieldService.delete(eventId, Number(field.id)));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations);
}
