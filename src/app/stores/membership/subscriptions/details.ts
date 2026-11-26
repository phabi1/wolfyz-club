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
import { catchError, combineLatest, concatMap, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import type { Campaign } from '../../../models/membership/campaign';
import { CampaignService } from '../../../services/membership/campaign.service';
import type { Contact } from '../../../models/membership/contact';
import type { Discipline } from '../../../models/membership/discipline';
import { Lesson } from '../../../models/membership/lesson';
import type { Session } from '../../../models/membership/session';
import type { SubscriptionDiscipline } from '../../../models/membership/subscription-discipline';
import {
  createEmptySubscription,
  type Subscription,
  type SubscriptionLicense,
} from '../../../models/membership/subscription';
import { ContactService } from '../../../services/membership/contact.service';
import { DisciplineService } from '../../../services/membership/discipline.service';
import { LessonService } from '../../../services/membership/lesson.service';
import { MemberService } from '../../../services/membership/member.service';
import { SessionService } from '../../../services/membership/session.service';
import { SubscriptionDisciplineService } from '../../../services/membership/subscription-discipline.service';
import { SubscriptionService } from '../../../services/membership/subscription.service';
import { EntityServiceWithCampaign } from '../../../services/membership/entity-service-with-campaign.interface';
import { campaignId$, campaignIdSnapshot } from '../../../utils/route';

type State = {
  campaignId: number | null;
  campaign: Campaign | null;
  lessons: Lesson[];
  disciplines: Discipline[];
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
  campaign: null,
  disciplines: [],
  updating: [],
  error: null,
};

export const membershipSubscriptionDetailsEvents = eventGroup({
  source: 'Membership Subscription Details',
  events: {
    init: type<{ campaignId: number }>(),
    initSuccess: type<{ lessons: Lesson[]; disciplines: Discipline[]; campaign: Campaign | null }>(),
    initFailure: type<{ error: any }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Subscription }>(),
    loadFailure: type<{ error: any }>(),
    update: type<{
      member?: Partial<Subscription['member']>;
      license?: Partial<SubscriptionLicense>;
      contacts?: Partial<Contact>[];
      sessions?: Partial<Session>[];
      disciplines?: Partial<SubscriptionDiscipline>[];
    }>(),
    updateSuccess: type<{
      member?: Partial<Subscription['member']>;
      license?: Subscription;
      contacts?: Contact[];
      sessions?: Session[];
      disciplines?: SubscriptionDiscipline[];
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
    on(
      membershipSubscriptionDetailsEvents.initSuccess,
      ({ payload: { lessons, disciplines, campaign } }) => ({
        lessons,
        disciplines,
        campaign,
      }),
    ),
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
      if (payload.disciplines) {
        updates.push('disciplines');
      }

      return {
        updating: [...state.updating, ...updates],
        error: null,
      };
    }),
    on(membershipSubscriptionDetailsEvents.updateSuccess, ({ payload }, state) => {
      const item = state.item as Subscription;

      const { member, license, contacts, sessions, disciplines } = payload;

      const updated: string[] = [];

      const newItem: Partial<Subscription> = {};

      if (member) {
        newItem.member = { ...item.member, ...member };
        updated.push('member');
      }
      if (license) {
        newItem.license_type = license.license_type;
        newItem.license_taken_at = license.license_taken_at;
        newItem.doctor = license.doctor;
        newItem.medical_certificate = license.medical_certificate;
        newItem.medical_certificate_date = license.medical_certificate_date;
        newItem.medical_form = license.medical_form;
        newItem.identity_photo = license.identity_photo;
        newItem.agree_exit = license.agree_exit;
        newItem.agree_image = license.agree_image;
        newItem.fields = license.fields ?? item.fields;
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
      if (disciplines) {
        newItem.disciplines = disciplines;
        updated.push('disciplines');
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
      campaignService = inject(CampaignService),
      disciplineService = inject(DisciplineService),
      subscriptionService = inject(SubscriptionService),
      contactService = inject(ContactService),
      sessionService = inject(SessionService),
      subscriptionDisciplineService = inject(SubscriptionDisciplineService),
      memberService = inject(MemberService),
    ) => ({
      init$: events.on(membershipSubscriptionDetailsEvents.init).pipe(
        switchMap(({ payload: { campaignId } }) =>
          forkJoin({
            lessons: lessonService.items(campaignId),
            disciplines: disciplineService.items(),
            // Only used for its start date (minors), never blocks the page
            campaign: campaignService
              .item(String(campaignId))
              .pipe(catchError(() => of(null))),
          }).pipe(
            mapResponse({
              next: ({ lessons, disciplines, campaign }) =>
                membershipSubscriptionDetailsEvents.initSuccess({
                  lessons: lessons.items,
                  disciplines: disciplines.items,
                  campaign,
                }),
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
        concatMap(({ payload: { member, license, sessions, contacts, disciplines } }) => {
          const actions: any[] = [];
          if (member) {
            actions.push(
              memberService
                .update(state.item()?.member_id || 0, member)
                .pipe(map((item) => ({ member: item }))),
            );
          }
          // License and disciplines are validated against each other by the API
          // (several disciplines require a competition license), so they are
          // saved one after the other in the order that keeps the data valid
          const saveLicense$: Observable<{ license?: Subscription }> = license
            ? subscriptionService
                .update(state.campaignId() || 0, state.id() || 0, license)
                .pipe(map((item) => ({ license: item })))
            : of({});
          const saveDisciplines$: Observable<{ disciplines?: SubscriptionDiscipline[] }> =
            disciplines
              ? syncItems(
                  disciplines,
                  state.item()?.disciplines || [],
                  subscriptionDisciplineService,
                  {
                    campaignId: state.campaignId() || 0,
                    subscription_id: state.id() || 0,
                  },
                ).pipe(map((item) => ({ disciplines: item as SubscriptionDiscipline[] })))
              : of({});

          if (license || disciplines) {
            // Downgrading from competition: reduce disciplines first
            const disciplinesFirst =
              !!license?.license_type &&
              license.license_type !== 'competition' &&
              state.item().license_type === 'competition';

            actions.push(
              disciplinesFirst
                ? saveDisciplines$.pipe(
                    concatMap((d) => saveLicense$.pipe(map((l) => ({ ...d, ...l })))),
                  )
                : saveLicense$.pipe(
                    concatMap((l) => saveDisciplines$.pipe(map((d) => ({ ...l, ...d })))),
                  ),
            );
          }
          if (sessions) {
            const syncSessionsAction = syncItems(
              sessions,
              state.item()?.sessions || [],
              sessionService,
              {
                campaignId: state.campaignId() || 0,
                subscription_id: state.id() || 0,
                member_id: state.item()?.member_id || null,
              },
            ).pipe(map((item) => ({ sessions: item })));
            actions.push(syncSessionsAction);
          }
          if (contacts) {
            const syncContactsAction = syncItems(
              contacts,
              state.item()?.contacts || [],
              contactService,
              {
                campaign_id: state.campaignId() || 0,
                subscription_id: state.id() || 0,
              },
            ).pipe(map((item) => ({ contacts: item })));
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
          campaignId: campaignIdSnapshot(route),
        }),
      );
      const subscription = combineLatest([campaignId$(route), route.params]).subscribe(([value, params]) => {
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

function syncItems<T extends { id?: number }, S extends EntityServiceWithCampaign<unknown>>(
  items: Partial<T>[],
  current: T[],
  service: S,
  params: Record<string, unknown>,
): Observable<unknown[]> {
  const { campaignId, subscriptionId } = params;
  const requestedExistingIds = new Set(
    items.filter((item) => Number(item.id) > 0).map((item) => Number(item.id)),
  );

  const toDelete = current.filter((session) => !requestedExistingIds.has(Number(session.id)));
  const toCreate = items.filter((session) => Number(session.id) <= 0);
  const toUpdate: Partial<T>[] = items.filter((item) => requestedExistingIds.has(Number(item.id)));

  const operations: Observable<unknown>[] = [];

  for (const item of toUpdate) {
    const data = {
      ...item,
      ...params,
      id: undefined,
    };
    operations.push(service.update(campaignId as number, Number(item.id), data as any));
  }

  for (const item of toDelete) {
    operations.push(service.delete(campaignId as number, Number(item.id)).pipe(map(() => null)));
  }

  for (const item of toCreate) {
    const data = {
      ...item,
      ...params,
      id: undefined,
    };
    operations.push(service.create(campaignId as number, data));
  }

  if (!operations.length) {
    return of([]);
  }

  return forkJoin(operations).pipe(map((results) => results.filter((result) => result !== null)));
}
