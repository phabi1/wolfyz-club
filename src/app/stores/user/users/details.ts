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
import { map, switchMap } from 'rxjs';
import type { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';
import { apiErrorMessage } from '../../../utils/api-error';

type State = {
  loading: boolean;
  item: User | null;
  error: string | null;
};

export const userUserDetailsEvents = eventGroup({
  source: 'User Users Details',
  events: {
    load: type<{ id: string }>(),
    loadSuccess: type<{ item: User }>(),
    loadFailure: type<{ error: string }>(),
  },
});

export const userUserDetails = signalStore(
  withState<State>({ loading: false, item: null, error: null }),
  withReducer(
    on(userUserDetailsEvents.load, () => ({ loading: true, error: null })),
    on(userUserDetailsEvents.loadSuccess, ({ payload: { item } }) => ({ loading: false, item })),
    on(userUserDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      item: null,
      error,
    })),
  ),
  withEventHandlers((_store, events = inject(Events), userService = inject(UserService)) => ({
    load$: events.on(userUserDetailsEvents.load).pipe(
      switchMap(({ payload: { id } }) =>
        userService.item(id).pipe(
          mapResponse({
            next: (item) => userUserDetailsEvents.loadSuccess({ item }),
            error: (error) => userUserDetailsEvents.loadFailure({ error: apiErrorMessage(error) }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(_store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      const subscription = route.params
        .pipe(map((params) => String(params['userId'])))
        .subscribe((id) => dispatcher.dispatch(userUserDetailsEvents.load({ id })));
      return () => subscription.unsubscribe();
    },
  }),
);
