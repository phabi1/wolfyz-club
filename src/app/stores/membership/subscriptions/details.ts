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
import { combineLatest, forkJoin, Observable, of, switchMap } from 'rxjs';
import type { Session } from '../../../models/membership/session';
import type { Subscription } from '../../../models/membership/subscription';
import { SubscriptionService } from '../../../services/membership/subscription.service';
import { ContactService } from '../../../services/membership/contact.service';
import { SessionService } from '../../../services/membership/session.service';
import { Lesson } from '../../../models/membership/lesson';
import { LessonService } from '../../../services/membership/lesson.service';

type State = {
  campaignId: number | null;
  lessons: Lesson[];
  id: number | null;
  item: Subscription | null;
  loading: boolean;
  contactsUpdating: boolean;
  sessionsUpdating: boolean;
  contactsUpdateError: any | null;
  sessionsUpdateError: any | null;
  error: any | null;
};

const initialState: State = {
  campaignId: null,
  id: null,
  item: null,
  loading: false,
  lessons: [],
  contactsUpdating: false,
  sessionsUpdating: false,
  contactsUpdateError: null,
  sessionsUpdateError: null,
  error: null,
};

export const membershipSubscriptionDetailsEvents = eventGroup({
  source: 'Membership Subscription Details',
  events: {
    init: type<{ campaignId: number; }>(),
    initSuccess: type<{ lessons: Lesson[]; }>(),
    initFailure: type<{ error: any }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Subscription }>(),
    loadFailure: type<{ error: any }>(),
    updateContacts: type<{
      campaignId: number;
      id: number;
      contacts: Subscription['contacts'];
    }>(),
    updateContactsSuccess: type<{ item: Subscription }>(),
    updateContactsFailure: type<{ error: any }>(),
    updateSessions: type<{
      campaignId: number;
      id: number;
      sessions: Pick<Session, 'id' | 'lesson_id' | 'subscription_id'>[];
    }>(),
    updateSessionsSuccess: type<{ item: Subscription }>(),
    updateSessionsFailure: type<{ error: any }>(),
  },
});

export const membershipSubscriptionDetails = signalStore(
  withState(initialState),
  withReducer(
    on(membershipSubscriptionDetailsEvents.init, ({ payload: { campaignId } }) => ({
      campaignId,
    })),
    on(membershipSubscriptionDetailsEvents.initSuccess, ({ payload: { lessons } }) => ({
      lessons,
    })),
    on(membershipSubscriptionDetailsEvents.initFailure, ({ payload: { error } }) => ({
      error,
    })),
    on(membershipSubscriptionDetailsEvents.load, ({ payload: { id } }) => ({
      loading: true,
      id,
      error: null,
    })),
    on(membershipSubscriptionDetailsEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
    })),
    on(membershipSubscriptionDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipSubscriptionDetailsEvents.updateContacts, () => ({
      contactsUpdating: true,
      contactsUpdateError: null,
    })),
    on(membershipSubscriptionDetailsEvents.updateContactsSuccess, ({ payload: { item } }) => ({
      contactsUpdating: false,
      item,
    })),
    on(membershipSubscriptionDetailsEvents.updateContactsFailure, ({ payload: { error } }) => ({
      contactsUpdating: false,
      contactsUpdateError: error,
    })),
    on(membershipSubscriptionDetailsEvents.updateSessions, () => ({
      sessionsUpdating: true,
      sessionsUpdateError: null,
    })),
    on(membershipSubscriptionDetailsEvents.updateSessionsSuccess, ({ payload: { item } }) => ({
      sessionsUpdating: false,
      item,
    })),
    on(membershipSubscriptionDetailsEvents.updateSessionsFailure, ({ payload: { error } }) => ({
      sessionsUpdating: false,
      sessionsUpdateError: error,
    })),
  ),
  withEventHandlers(
    (
      state,
      events = inject(Events),
      lessonService = inject(LessonService),
      subscriptionService = inject(SubscriptionService),
      contactService = inject(ContactService),
      sessionService = inject(SessionService),
    ) => ({
      init$: events.on(membershipSubscriptionDetailsEvents.init).pipe(
        switchMap(({ payload: { campaignId } }) =>
          lessonService.items(campaignId).pipe(
            mapResponse({
              next: ({ items }) => membershipSubscriptionDetailsEvents.initSuccess({ lessons: items }),
              error: (error) => membershipSubscriptionDetailsEvents.initFailure({ error }),
            }),
          )
        ),
      ),
      load$: events.on(membershipSubscriptionDetailsEvents.load).pipe(
        switchMap(({ payload: { id } }) =>
          subscriptionService.item(state.campaignId()|| 0, +id).pipe(
            mapResponse({
              next: (item) => membershipSubscriptionDetailsEvents.loadSuccess({ item }),
              error: (error) => membershipSubscriptionDetailsEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
      updateContacts$: events.on(membershipSubscriptionDetailsEvents.updateContacts).pipe(
        switchMap(({ payload: { campaignId, id, contacts } }) =>
          syncContacts({
            campaignId,
            subscriptionId: id,
            contacts,
            current: state.item()?.contacts || [],
            contactService,
          }).pipe(
            switchMap(() => subscriptionService.item(campaignId, id)),
            mapResponse({
              next: (item) => membershipSubscriptionDetailsEvents.updateContactsSuccess({ item }),
              error: (error) =>
                membershipSubscriptionDetailsEvents.updateContactsFailure({ error }),
            }),
          ),
        ),
      ),
      updateSessions$: events.on(membershipSubscriptionDetailsEvents.updateSessions).pipe(
        switchMap(({ payload: { campaignId, id, sessions } }) =>
          syncSessions({
            campaignId,
            subscriptionId: id,
            sessions,
            current: state.item()?.sessions || [],
            memberId: state.item()?.member_id || null,
            sessionService,
          }).pipe(
            switchMap(() => subscriptionService.item(campaignId, id)),
            mapResponse({
              next: (item) => membershipSubscriptionDetailsEvents.updateSessionsSuccess({ item }),
              error: (error) =>
                membershipSubscriptionDetailsEvents.updateSessionsFailure({ error }),
            })
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      dispatcher.dispatch(
        membershipSubscriptionDetailsEvents.init({
          campaignId: 2,
        }),
      );
      const subscription = combineLatest([of(2), route.params]).subscribe(([value, params]) => {
        dispatcher.dispatch(
          membershipSubscriptionDetailsEvents.load({
            id: params['subscriptionId'],
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);

function syncContacts(params: {
  campaignId: number;
  subscriptionId: number;
  contacts: Subscription['contacts'];
  current: Subscription['contacts'];
  contactService: ContactService;
}): Observable<unknown[]> {
  const { campaignId, subscriptionId, contacts, current, contactService } = params;

  const requestedExistingIds = new Set(
    contacts
      .filter((contact) => Number(contact.id) > 0)
      .map((contact) => Number(contact.id)),
  );

  const toDelete = current.filter((contact) => !requestedExistingIds.has(Number(contact.id)));
  const toCreate = contacts.filter((contact) => Number(contact.id) <= 0);
  const toUpdate = contacts.filter((contact) => Number(contact.id) > 0);

  const operations: Observable<unknown>[] = [];

  for (const contact of toCreate) {
    operations.push(
      contactService.create(campaignId, {
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone,
        subscription_id: subscriptionId,
      } as any),
    );
  }

  for (const contact of toUpdate) {
    operations.push(
      contactService.update(campaignId, String(contact.id), {
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone,
      }),
    );
  }

  for (const contact of toDelete) {
    operations.push(contactService.delete(campaignId, String(contact.id)));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations);
}

function syncSessions(params: {
  campaignId: number;
  subscriptionId: number;
  sessions: Pick<Session, 'id' | 'lesson_id' | 'subscription_id'>[];
  current: Session[];
  memberId: number | null;
  sessionService: SessionService;
}): Observable<unknown[]> {
  const { campaignId, subscriptionId, sessions, current, memberId, sessionService } = params;

  const requestedExistingIds = new Set(
    sessions
      .filter((session) => Number(session.id) > 0)
      .map((session) => Number(session.id)),
  );

  const toDelete = current.filter((session) => !requestedExistingIds.has(Number(session.id)));
  const toCreate = sessions.filter((session) => Number(session.id) <= 0);

  const operations: Observable<unknown>[] = [];

  for (const session of toCreate) {
    operations.push(
      sessionService.create(campaignId, {
        lesson_id: session.lesson_id,
        subscription_id: subscriptionId,
        member_id: memberId,
      } as any),
    );
  }

  for (const session of toDelete) {
    operations.push(sessionService.delete(campaignId, Number(session.id)));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations);
}
