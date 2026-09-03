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
import type { Lesson } from '../../../models/membership/lesson';
import { LessonService } from '../../../services/membership/lesson.service';

type State = {
  campaign_id: number;
  loading: boolean;
  columns: DatagridColumn[];
  items: Lesson[];
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
  campaign_id: 0,
  loading: false,
  columns: [
    { name: 'id', header: 'ID' },
    {
      name: 'title',
      header: 'Titre',
      cell: { type: 'text', options: { featured: true } },
    },
    { name: 'day', header: 'Jour' },
    { name: 'lesson_start', header: 'Debut', type: 'date' },
    { name: 'lesson_end', header: 'Fin', type: 'date' },
    { name: 'participant_nb', header: 'Participants' },
    { name: 'participant_max', header: 'Max' },
  ],
  items: [],
  page: 1,
  size: 10,
  total: 0,
  filters: {},
  search: '',
  sort: 'day,lesson_start,title',
  order: 'asc',
  error: null,
};

export const membershipLessonListEvents = eventGroup({
  source: 'Membership Lesson List',
  events: {
    load: type<
      Partial<{
        campaign_id: number;
        page: number;
        size: number;
        sort: string;
        order: 'asc' | 'desc';
        search: string;
      }>
    >(),
    loadSuccess: type<{ items: Lesson[]; total: number }>(),
    loadFailure: type<{ error: any }>(),
    setPagination: type<Partial<{ page: number; size: number }>>(),
    setSorting: type<Partial<{ sort: string; order: 'asc' | 'desc' }>>(),
    setSearch: type<string>(),
  },
});

export const membershipLessonList = signalStore(
  withState<State>(initialState),
  withReducer(
    on(membershipLessonListEvents.load, ({ payload: { campaign_id, ...options } }) => ({
      loading: true,
      campaign_id,
      ...options,
    })),
    on(membershipLessonListEvents.loadSuccess, ({ payload: { items, total } }) => ({
      loading: false,
      items,
      total,
    })),
    on(membershipLessonListEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
    on(membershipLessonListEvents.setPagination, ({ payload: { page, size } }) => ({
      page,
      size,
    })),
    on(membershipLessonListEvents.setSorting, ({ payload: { sort, order } }) => ({
      sort,
      order,
      page: 1,
    })),
    on(membershipLessonListEvents.setSearch, ({ payload }) => ({
      search: payload,
    })),
  ),
  withEventHandlers((
    store,
    events = inject(Events),
    lessonService = inject(LessonService),
    router = inject(Router),
  ) => ({
    load$: events.on(membershipLessonListEvents.load).pipe(
      switchMap(() =>
        lessonService
          .items(store.campaign_id(), {
            page: store.page(),
            size: store.size(),
            sort: store.sort(),
            order: store.order(),
            search: store.search(),
            fields: [
              'id',
              'title',
              'day',
              'lesson_start',
              'lesson_end',
              'participant_nb',
              'participant_max',
            ],
          })
          .pipe(
            mapResponse({
              next: ({ items, total }) => membershipLessonListEvents.loadSuccess({ items, total }),
              error: (error) => membershipLessonListEvents.loadFailure({ error }),
            }),
          ),
      ),
    ),
    refreshUrl$: events
      .on(
        membershipLessonListEvents.setSearch,
        membershipLessonListEvents.setPagination,
        membershipLessonListEvents.setSorting,
      )
      .pipe(
        tap(() => {
          const params: any = {};

          params['page'] = store.page();
          params['size'] = store.size();
          params['sort'] = store.sort();
          params['order'] = store.order();
          params['search'] = store.search();

          router.navigate([], {
            queryParams: params,
            queryParamsHandling: 'merge',
          });
        }),
      ),
    logError$: events.on(membershipLessonListEvents.loadFailure).pipe(
      tap(({ payload: { error } }) => {
        console.error('Membership lesson list load error:', error);
      }),
    ),
  })),
  withHooks({
    onInit: (store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) => {
      const subscription = combineLatest([of(2), route.queryParamMap]).subscribe(
        ([campaignId, params]) => {
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
            membershipLessonListEvents.load({
              campaign_id: campaignId,
              ...payload,
            }),
          );
        },
      );
      return () => subscription.unsubscribe();
    },
  }),
);
