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
import type { Lesson } from '../../../models/membership/lesson';
import { LessonService } from '../../../services/membership/lesson.service';

type State = {
  campaignId: number | null;
  id: number | null;
  item: Lesson | null;
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

export const membershipLessonDetailsEvents = eventGroup({
  source: 'Membership Lesson Details',
  events: {
    init: type<{ campaignId: number }>(),
    load: type<{ id: number }>(),
    loadSuccess: type<{ item: Lesson }>(),
    loadFailure: type<{ error: any }>(),
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
  ),
  withEventHandlers((
    state,
    events = inject(Events),
    lessonService = inject(LessonService),
  ) => ({
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
