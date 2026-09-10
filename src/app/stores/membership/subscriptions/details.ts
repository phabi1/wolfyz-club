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
import { combineLatest, concatMap, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import type { Contact } from '../../../models/membership/contact';
import { Lesson } from '../../../models/membership/lesson';
import type { Session } from '../../../models/membership/session';
import {
  createEmptySubscription,
  type Subscription,
} from '../../../models/membership/subscription';
import { ContactService } from '../../../services/membership/contact.service';
import { LessonService } from '../../../services/membership/lesson.service';
import { MemberService } from '../../../services/membership/member.service';
import { SessionService } from '../../../services/membership/session.service';
import { SubscriptionService } from '../../../services/membership/subscription.service';

type State = {
  campaignId: number | null;
  lessons: Lesson[];
  id: number | null;
  item: Subscription;
  loading: boolean;
  updating: string[];
  error: any | null;
};

const initialState: State = {
  campaignId: null,
  id: null,
  item: createEmptySubscription(),
  loading: false,
  lessons: [],
  updating: [],
  error: null,
};

export const membershipSubscriptionDetailsEvents = eventGroup({
  source: 'Membership Subscription Details',
  events: {
    init: type<{ campaignId: number }>(),
    initSuccess: type<{ lessons: Lesson[] }>(),
    initFailure: type<{ error: any }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Subscription }>(),
    loadFailure: type<{ error: any }>(),
    update: type<{
      member?: Partial<Subscription['member']>;
      license?: Partial<Omit<Subscription, 'member' | 'contacts' | 'sessions'>>;
      contacts?: Partial<Contact>[];
      sessions?: Partial<Session>[];
    }>(),
    updateSuccess: type<{
      member?: Partial<Subscription['member']>;
      license?: Partial<Omit<Subscription, 'member' | 'contacts' | 'sessions'>>;
      contacts?: Contact[];
      sessions?: Session[];
    }>(),
    updateFailure: type<{ error: any }>(),
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
    on(membershipSubscriptionDetailsEvents.update, ({ payload }, state) => {
      const updates = [];

      if (payload.member) {
        updates.push('member');
      }

      if (payload.license) {
        updates.push('license');
      }
      if (payload.contacts) {
        updates.push('contacts');
      }
      if (payload.sessions) {
        updates.push('sessions');
      }

      return {
        updating: [...state.updating, ...updates],
        error: null,
      };
    }),
    on(membershipSubscriptionDetailsEvents.updateSuccess, ({ payload }, state) => {
      const item = state.item as Subscription;

      const { member, license, contacts, sessions } = payload;

      const updated: string[] = [];

      const newItem: Partial<Subscription> = {};

      if (member) {
        newItem.member = { ...item.member, ...member };
        updated.push('member');
      }
      if (license) {
        newItem.license_type = license?.license_type ?? item.license_type;
        newItem.fields = license?.fields ?? item.fields;
        updated.push('license');
      }
      if (contacts) {
        newItem.contacts = contacts;
        updated.push('contacts');
      }
      if (sessions) {
        newItem.sessions = sessions;
        updated.push('sessions');
      }

      return {
        item: { ...item, ...newItem },
        updating: state.updating.filter((key) => !updated.includes(key)),
      };
    }),
    on(membershipSubscriptionDetailsEvents.updateFailure, ({ payload: { error } }) => ({
      updating: [],
      error,
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
      memberService = inject(MemberService),
    ) => ({
      init$: events.on(membershipSubscriptionDetailsEvents.init).pipe(
        switchMap(({ payload: { campaignId } }) =>
          lessonService.items(campaignId).pipe(
            mapResponse({
              next: ({ items }) =>
                membershipSubscriptionDetailsEvents.initSuccess({ lessons: items }),
              error: (error) => membershipSubscriptionDetailsEvents.initFailure({ error }),
            }),
          ),
        ),
      ),
      load$: events.on(membershipSubscriptionDetailsEvents.load).pipe(
        switchMap(({ payload: { id } }) =>
          subscriptionService.item(state.campaignId() || 0, +id).pipe(
            mapResponse({
              next: (item) => membershipSubscriptionDetailsEvents.loadSuccess({ item }),
              error: (error) => membershipSubscriptionDetailsEvents.loadFailure({ error }),
            }),
          ),
        ),
      ),
      update$: events.on(membershipSubscriptionDetailsEvents.update).pipe(
        concatMap(({ payload: { member, license, sessions, contacts } }) => {
          const actions: any[] = [];
          if (member) {
            actions.push(
              memberService
                .update(state.item()?.member_id || 0, member)
                .pipe(map((item) => ({ member: item }))),
            );
          }
          if (license) {
            actions.push(
              subscriptionService
                .update(state.campaignId() || 0, state.item()?.id || 0, {
                  fields: {
                    ...state.item()?.fields,
                    ...license,
                  },
                })
                .pipe(map((item) => ({ license: item }))),
            );
          }
          if (sessions) {
            const syncSessionsAction = syncSessions({
              campaignId: state.campaignId() || 0,
              subscriptionId: state.item()?.id || 0,
              sessions,
              current: state.item()?.sessions || [],
              memberId: state.item()?.member_id || null,
              sessionService,
            }).pipe(map((item) => ({ sessions: item })));
            actions.push(syncSessionsAction);
          }
          if (contacts) {
            const syncContactsAction = syncContacts({
              campaignId: state.campaignId() || 0,
              subscriptionId: state.item()?.id || 0,
              contacts,
              current: state.item()?.contacts || [],
              contactService,
            }).pipe(map((item) => ({ contacts: item })));
            actions.push(syncContactsAction);
          }
          return forkJoin(actions).pipe(
            mapResponse({
              next: (results) =>
                membershipSubscriptionDetailsEvents.updateSuccess({
                  ...results.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                }),
              error: (error) => membershipSubscriptionDetailsEvents.updateFailure({ error }),
            }),
          );
        }),
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
  contacts: Partial<Contact>[];
  current: Partial<Contact>[];
  contactService: ContactService;
}): Observable<unknown[]> {
  const { campaignId, subscriptionId, contacts, current, contactService } = params;

  const requestedExistingIds = new Set(
    contacts.filter((contact) => Number(contact.id) > 0).map((contact) => Number(contact.id)),
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
  sessions: Partial<Session>[];
  current: Partial<Session>[];
  memberId: number | null;
  sessionService: SessionService;
}): Observable<unknown[]> {
  const { campaignId, subscriptionId, sessions, current, memberId, sessionService } = params;

  const requestedExistingIds = new Set(
    sessions.filter((session) => Number(session.id) > 0).map((session) => Number(session.id)),
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
