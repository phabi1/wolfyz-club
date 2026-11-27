import { inject } from '@angular/core';
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
import { switchMap } from 'rxjs';
import type { Role } from '../../../models/user/role';
import { RoleService } from '../../../services/user/role.service';
import { apiErrorMessage } from '../../../utils/api-error';

type State = {
  loading: boolean;
  items: Role[];
  error: string | null;
};

export const userRoleListEvents = eventGroup({
  source: 'User Roles List',
  events: {
    load: type<void>(),
    loadSuccess: type<{ items: Role[] }>(),
    loadFailure: type<{ error: string }>(),
  },
});

export const userRoleList = signalStore(
  withState<State>({ loading: false, items: [], error: null }),
  withReducer(
    on(userRoleListEvents.load, () => ({ loading: true, error: null })),
    on(userRoleListEvents.loadSuccess, ({ payload: { items } }) => ({ loading: false, items })),
    on(userRoleListEvents.loadFailure, ({ payload: { error } }) => ({ loading: false, error })),
  ),
  withEventHandlers((_store, events = inject(Events), roleService = inject(RoleService)) => ({
    load$: events.on(userRoleListEvents.load).pipe(
      switchMap(() =>
        roleService.items().pipe(
          mapResponse({
            next: ({ items }) => userRoleListEvents.loadSuccess({ items }),
            error: (error) => userRoleListEvents.loadFailure({ error: apiErrorMessage(error) }),
          }),
        ),
      ),
    ),
  })),
  withHooks({
    onInit(_store, dispatcher = inject(Dispatcher)) {
      dispatcher.dispatch(userRoleListEvents.load());
    },
  }),
);
