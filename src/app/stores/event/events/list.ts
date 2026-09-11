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
import { combineLatest, of, switchMap, tap } from 'rxjs';
import type { DatagridColumn } from '../../../components/ui/datagrid/column';
import type { Event } from '../../../models/event/event';
import { EventService } from '../../../services/event/event.service';

type State = {
  loading: boolean;
  columns: DatagridColumn[];
  items: Event[];
  page: number;
  size: number;
  total: number;
  filters: any;
  sort: string;
  search: string;
  order: 'asc' | 'desc';
  error: any | null;
};

const initialState: State = {
  loading: false,
  columns: [
    { name: 'id', header: 'ID' },
    { name: 'title', header: 'Title', data: 'title' },
    {
      name: 'participant_nb',
      header: 'Participants',
      data: 'participant_nb',
      type: 'number',
    },
    {
      name: 'participant_max',
      header: 'Max Participants',
      data: 'participant_max',
      type: 'number',
    },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  filters: {},
  search: '',
  sort: 'member.lastname,member.firstname',
  order: 'asc',
  error: null,
};

export const eventEventListEvents = eventGroup({
  source: 'Membership Request List',
  events: {
    load: type<
      Partial<{
        page: number;
        size: number;
        sort: string;
        order: 'asc' | 'desc';
        search: string;
      }>
    >(),
    loadSuccess: type<{ items: Event[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
    setPagination: type<Partial<{ page: number; size: number }>>(),
    setSorting: type<Partial<{ sort: string; order: 'asc' | 'desc' }>>(),
    setSearch: type<string>(),
  },
});

export const eventEventList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(eventEventListEvents.load, ({ payload: { ...options } }) => ({
      loading: true,
      ...options,
    })),
    on(eventEventListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(eventEventListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(eventEventListEvents.setPagination, ({ payload: { page, size } }) => ({
      page,
      size,
    })),
    on(eventEventListEvents.setSorting, ({ payload: { sort, order } }) => ({
      sort,
      order,
      page: 1,
    })),
    on(eventEventListEvents.setSearch, ({ payload }) => ({
      search: payload,
    })),
  ),
  withEventHandlers(
    (
      store,
      events = inject(Events),
      eventService = inject(EventService),
      activatedRoute = inject(ActivatedRoute),
      router = inject(Router),
    ) => ({
      load$: events.on(eventEventListEvents.load).pipe(
        switchMap(() =>
          eventService
            .items({
              page: store.page(),
              size: store.size(),
              sort: store.sort(),
              order: store.order(),
              search: store.search(),
            })
            .pipe(
              mapResponse({
                next: ({ items, total }) => eventEventListEvents.loadSuccess({ items, total }),
                error: (error) => eventEventListEvents.loadFailure({ error }),
              }),
            ),
        ),
      ),
      refreshUrl$: events
        .on(
          eventEventListEvents.setSearch,
          eventEventListEvents.setPagination,
          eventEventListEvents.setSorting,
        )
        .pipe(
          tap(() => {
            const params: any = {};

            const page = store.page();
            const size = store.size();
            const sort = store.sort();
            const order = store.order();
            const search = store.search();

            params['page'] = page;
            params['size'] = size;
            params['sort'] = sort;
            params['order'] = order;
            params['search'] = search;

            router.navigate([], {
              queryParams: params,
              queryParamsHandling: 'merge',
            });
          }),
        ),
      logError$: events.on(eventEventListEvents.loadFailure).pipe(
        tap(({ payload: { error } }) => {
          console.error('Membership request list load error:', error);
        }),
      ),
    }),
  ),
  withHooks({
    onInit: (store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = combineLatest([route.queryParamMap]).subscribe(([params]) => {
        const payload: any = {};

        if (params.get('page')) {
          payload['page'] = +(params.get('page') || 1);
        }
        if (params.get('size')) {
          payload['size'] = +(params.get('size') || 10);
        }
        if (params.get('sort')) {
          payload['sort'] = params.get('sort');
        }
        if (params.get('order')) {
          payload['order'] = (params.get('order') as 'asc' | 'desc') || 'asc';
        }
        payload['search'] = params.get('search') || '';

        dispatcher.dispatch(
          eventEventListEvents.load({
            ...payload,
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
