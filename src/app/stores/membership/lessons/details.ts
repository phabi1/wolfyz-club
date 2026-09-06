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
import { combineLatest, map, of, switchMap } from 'rxjs';
import type { Lesson } from '../../../models/membership/lesson';
import { LessonService } from '../../../services/membership/lesson.service';
import { Subscription } from '../../../models/membership/subscription';
import { toDate } from '../../../utils/date';

type Participant = Subscription & { age: number };

type State = {
  campaignId: number | null;
  id: number | null;
  item: Lesson | null;
  loading: boolean;
  error: any | null;
  fetchingParticipants: boolean;
  participants: Participant[];
};

const initialState: State = {
  campaignId: null,
  id: null,
  item: null,
  loading: false,
  error: null,
  fetchingParticipants: false,
  participants: [],
};

export const membershipLessonDetailsEvents = eventGroup({
  source: 'Membership Lesson Details',
  events: {
    init: type<{ campaignId: number }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Lesson }>(),
    loadFailure: type<{ error: any }>(),
    fetchParticipants: type<void>(),
    fetchParticipantsSuccess: type<{ participants: Participant[] }>(),
    fetchParticipantsFailure: type<{ error: any }>(),
  },
});

export const membershipLessonDetails = signalStore(
  withState(initialState),
  withReducer(
    on(membershipLessonDetailsEvents.init, ({ payload: { campaignId } }) => ({
      campaignId,
    })),
    on(membershipLessonDetailsEvents.load, ({ payload: { id } }) => ({
      loading: true,
      id,
      error: null,
    })),
    on(membershipLessonDetailsEvents.loadSuccess, ({ payload: { item } }) => ({
      loading: false,
      item,
    })),
    on(membershipLessonDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipLessonDetailsEvents.fetchParticipants, () => ({
      fetchingParticipants: true,
      error: null,
    })),
    on(membershipLessonDetailsEvents.fetchParticipantsSuccess, ({ payload: { participants } }) => ({
      fetchingParticipants: false,
      participants,
    })),
    on(membershipLessonDetailsEvents.fetchParticipantsFailure, ({ payload: { error } }) => ({
      fetchingParticipants: false,
      error,
    })),
  ),
  withEventHandlers((state, events = inject(Events), lessonService = inject(LessonService)) => ({
    load$: events.on(membershipLessonDetailsEvents.load).pipe(
      switchMap(({ payload: { id } }) =>
        lessonService.item(state.campaignId() || 0, id).pipe(
          mapResponse({
            next: (item) => membershipLessonDetailsEvents.loadSuccess({ item }),
            error: (error) => membershipLessonDetailsEvents.loadFailure({ error }),
          }),
        ),
      ),
    ),
    loadSuccess$: events.on(membershipLessonDetailsEvents.loadSuccess).pipe(
      map(({ payload: { item } }) => {
        return membershipLessonDetailsEvents.fetchParticipants();
      }),
    ),
    fetchParticipants$: events.on(membershipLessonDetailsEvents.fetchParticipants).pipe(
      switchMap(() =>
        lessonService.participants(state.campaignId() || 0, state.id() || 0).pipe(
          mapResponse({
            next: (subscriptions) =>
              membershipLessonDetailsEvents.fetchParticipantsSuccess({ participants: subscriptions.map(s => {
                const birthdate = toDate(s.member.birthdate);
                return { ...s, age: birthdate ? Math.floor((Date.now() - birthdate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0 };
              }),
            }),
            error: (error) => membershipLessonDetailsEvents.fetchParticipantsFailure({ error }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      dispatcher.dispatch(
        membershipLessonDetailsEvents.init({
          campaignId: 2,
        }),
      );

      const subscription = combineLatest([of(2), route.params]).subscribe(([, params]) => {
        dispatcher.dispatch(
          membershipLessonDetailsEvents.load({
            id: +(params['lessonId'] || 0),
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
