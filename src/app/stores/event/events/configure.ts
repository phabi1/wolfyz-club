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
              syncItems({
                eventId: store.item().id,
                items: sessions,
                current: store.item().sessions || [],
                isChanged: (currentSession, session) =>
                  !currentSession ||
                  currentSession.session_start !== session.session_start ||
                  currentSession.session_end !== session.session_end,
                create: (eventId, session) =>
                  sessionService.create(eventId, {
                    session_start: session.session_start,
                    session_end: session.session_end,
                    event_id: eventId,
                  } as any),
                update: (eventId, id, session) =>
                  sessionService.update(eventId, id, {
                    session_start: session.session_start,
                    session_end: session.session_end,
                  } as any),
                remove: (eventId, id) => sessionService.delete(eventId, id),
              }),
            );
          }

          if (Array.isArray(tickets)) {
            actions.push(
              syncItems({
                eventId: store.item().id,
                items: tickets,
                current: store.item().tickets || [],
                isChanged: (currentTicket, ticket) =>
                  !currentTicket ||
                  currentTicket.title !== ticket.title ||
                  currentTicket.amount !== ticket.amount ||
                  currentTicket.participant_max !== ticket.participant_max ||
                  currentTicket.member_only !== ticket.member_only,
                create: (eventId, ticket) =>
                  ticketService.create(eventId, {
                    title: ticket.title || '',
                    amount: ticket.amount,
                    participant_max: ticket.participant_max || 0,
                    member_only: ticket.member_only,
                    event_id: eventId,
                  } as any),
                update: (eventId, id, ticket) =>
                  ticketService.update(eventId, id, {
                    title: ticket.title || '',
                    amount: ticket.amount,
                    participant_max: ticket.participant_max || 0,
                    member_only: ticket.member_only,
                    event_id: eventId,
                  } as any),
                remove: (eventId, id) => ticketService.delete(eventId, id),
              }),
            );
          }

          if (Array.isArray(participant_fields)) {
            actions.push(
              syncItems({
                eventId: store.item().id,
                items: participant_fields,
                current: store.item().participant_fields || [],
                isChanged: (currentField, field) =>
                  !currentField ||
                  currentField.label !== field.label ||
                  currentField.type !== field.type ||
                  currentField.required !== field.required ||
                  currentField.options !== field.options ||
                  currentField.description !== field.description ||
                  currentField.tickets !== field.tickets,
                create: (eventId, field) =>
                  participantFieldService.create(eventId, {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    options: field.options,
                    description: field.description,
                    tickets: field.tickets,
                    event_id: eventId,
                  } as any),
                update: (eventId, id, field) =>
                  participantFieldService.update(eventId, id, {
                    label: field.label,
                    type: field.type,
                    required: field.required,
                    options: field.options,
                    description: field.description,
                    tickets: field.tickets,
                    event_id: eventId,
                  } as any),
                remove: (eventId, id) => participantFieldService.delete(eventId, id),
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

type SyncOperation = 'create' | 'update' | 'delete' | 'skip';

function syncItems<T extends { id?: number }>(params: {
  eventId: number;
  items: Partial<T>[];
  current: Partial<T>[];
  isChanged: (currentItem: Partial<T> | undefined, item: Partial<T>) => boolean;
  create: (eventId: number, item: Partial<T>) => Observable<unknown>;
  update: (eventId: number, id: number, item: Partial<T>) => Observable<unknown>;
  remove: (eventId: number, id: number) => Observable<unknown>;
}): Observable<unknown[]> {
  const { eventId, items, current, isChanged, create, update, remove } = params;

  const requestedExistingIds = new Set(
    items.filter((item) => item.id !== undefined).map((item) => Number(item.id)),
  );

  const toDelete = current.filter((item) => !requestedExistingIds.has(Number(item.id)));
  const toCreate = items.filter((item) => item.id === undefined);
  const toUpdate = items
    .filter((item) => item.id !== undefined)
    .filter((item) => isChanged(current.find((stored) => stored.id === item.id), item));
  const toSkip = items.filter((item) => {
    const currentItem = current.find((stored) => stored.id === item.id);
    return !!currentItem && !isChanged(currentItem, item);
  });

  const operations: Observable<unknown>[] = [];

  for (const operation of ['update', 'delete', 'create', 'skip'] as SyncOperation[]) {
    if (operation === 'create') {
      for (const item of toCreate) {
        operations.push(create(eventId, item));
      }
      continue;
    }

    if (operation === 'update') {
      for (const item of toUpdate) {
        operations.push(update(eventId, Number(item.id), item));
      }
      continue;
    }

    if (operation === 'delete') {
      for (const item of toDelete) {
        operations.push(remove(eventId, Number(item.id)));
      }
      continue;
    }

    for (const item of toSkip) {
      operations.push(of(item));
    }
  }

  return forkJoin(operations);
}
