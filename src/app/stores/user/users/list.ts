import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { switchMap, tap } from 'rxjs';
import type { DatagridColumn } from '../../../components/ui/datagrid/column';
import type { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';
import { apiErrorMessage } from '../../../utils/api-error';

type State = {
  loading: boolean;
  columns: DatagridColumn[];
  items: User[];
  page: number;
  size: number;
  total: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
  error: string | null;
};

const initialState: State = {
  loading: false,
  columns: [
    { name: 'lastname', header: $localize`:@@user.users.column.lastname:Last name` },
    { name: 'firstname', header: $localize`:@@user.users.column.firstname:First name` },
    { name: 'email', header: $localize`:@@common.label.email:Email` },
    { name: 'roles', header: $localize`:@@user.users.column.roles:Roles`, cell: 'user-role' },
    {
      name: 'email_verified',
      header: $localize`:@@user.users.column.emailVerified:Email verified`,
      cell: 'yes-no',
    },
    { name: 'created_at', header: $localize`:@@user.users.column.createdAt:Created`, type: 'date' },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  sort: 'lastname',
  order: 'asc',
  search: '',
  error: null,
};

export const userUserListEvents = eventGroup({
  source: 'User Users List',
  events: {
    load: type<Partial<{ page: number; size: number; search: string }>>(),
    loadSuccess: type<{ items: User[]; total: number }>(),
    loadFailure: type<{ error: string }>(),
    setPagination: type<{ page: number; size: number }>(),
    setSearch: type<string>(),
  },
});

export const userUserList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(userUserListEvents.load, ({ payload }) => ({ loading: true, error: null, ...payload })),
    on(userUserListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(userUserListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      items: [],
      total: 0,
      error,
    })),
    on(userUserListEvents.setPagination, ({ payload: { page, size } }) => ({ page, size })),
    on(userUserListEvents.setSearch, ({ payload }) => ({ search: payload, page: 1 })),
  ),
  withEventHandlers(
    (store, events = inject(Events), userService = inject(UserService), router = inject(Router)) => ({
      load$: events.on(userUserListEvents.load).pipe(
        switchMap(() =>
          userService
            .items({
              page: store.page(),
              size: store.size(),
              sort: store.sort(),
              order: store.order(),
              search: store.search(),
            })
            .pipe(
              mapResponse({
                next: ({ items, total }) => userUserListEvents.loadSuccess({ items, total }),
                error: (error) => userUserListEvents.loadFailure({ error: apiErrorMessage(error) }),
              }),
            ),
        ),
      ),
      // The query params are the source of truth: changing them reloads the list.
      refreshUrl$: events.on(userUserListEvents.setSearch, userUserListEvents.setPagination).pipe(
        tap(() => {
          router.navigate([], {
            queryParams: { page: store.page(), size: store.size(), search: store.search() || null },
            queryParamsHandling: 'merge',
          });
        }),
      ),
    }),
  ),
  withHooks({
    onInit: (_store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = route.queryParamMap.subscribe((params) => {
        dispatcher.dispatch(
          userUserListEvents.load({
            page: +(params.get('page') || 1),
            size: +(params.get('size') || 10),
            search: params.get('search') || '',
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
