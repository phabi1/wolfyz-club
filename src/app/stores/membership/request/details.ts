import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withHooks, withState } from '@ngrx/signals';
import type { RequestPay } from '../../../models/membership/request-pay';
import {
  Dispatcher,
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { combineLatest, forkJoin, map, merge, Observable, of, switchMap, tap } from 'rxjs';
import { RequestService } from '../../../services/membership/request.service';
import { RequestDetails } from '../../../models/membership/request-details';
import { MemberService } from '../../../services/membership/member.service';

type StatusChangeAction = 'approved' | 'rejected' | 'canceled' | 'paid';

type State = {
  campaignId: number | null;
  id: number | null;
  item: RequestDetails | null;
  history: any[];
  pay: RequestPay;
  discountAmount: number;
  calculating: boolean;
  loading: boolean;
  error: any | null;
};

const initialState: State = {
  campaignId: null,
  id: null,
  item: null,
  history: [],
  pay: { pricing_breakdown: [], total_amount: 0, currency: '' },
  discountAmount: 0,
  calculating: true,
  loading: false,
  error: null,
};

export const membershipRequestDetailsEvents = eventGroup({
  source: 'Membership Request Details',
  events: {
    load: type<{ campaignId: number; id: number }>(),
    loadSuccess: type<{ item: RequestDetails; discountAmount: number; history: any[] }>(),
    loadFailure: type<{ error: any }>(),
    setStatusOfMember: type<{
      participantId: string;
      status: 'loading' | 'verified' | 'suggested' | 'anonymous';
      suggestions: any[];
    }>(),
    setDiscountAmount: type<{ discountAmount: number }>(),
    setDiscountAmountSuccess: type<void>(),
    setDiscountAmountFailure: type<{ error: any }>(),
    changeStatus: type<{
      campaignId: number;
      id: number;
      status: StatusChangeAction;
      reason: string;
    }>(),
    calculatePay: type<{ campaignId: number; data: any; discountAmount?: number }>(),
    calculatePaySuccess: type<{
      pay: RequestPay;
    }>(),
    calculatePayFailure: type<{ error: any }>(),
  },
});

export const membershipRequestDetails = signalStore(
  withState(initialState),
  withReducer(
    on(membershipRequestDetailsEvents.load, ({ payload: { campaignId, id } }) => ({
      loading: true,
      campaignId,
      id,
      error: null,
    })),
    on(
      membershipRequestDetailsEvents.setStatusOfMember,
      ({ payload: { participantId, status, suggestions } }, state) => ({
        loading: false,
        item: state.item
          ? {
              ...state.item,
              data: {
                ...state.item.data,
                participants: state.item.data['participants'].map((participant: any) =>
                  participant.id === participantId
                    ? {
                        ...participant,
                        member: {
                          status,
                          suggestions,
                        },
                      }
                    : participant,
                ),
              },
            }
          : null,
      }),
    ),
    on(membershipRequestDetailsEvents.setDiscountAmount, ({ payload: { discountAmount } }) => ({
      discountAmount,
    })),
    on(membershipRequestDetailsEvents.changeStatus, () => ({ loading: true, error: null })),
    on(membershipRequestDetailsEvents.calculatePay, () => ({ calculating: true, error: null })),
    on(membershipRequestDetailsEvents.calculatePaySuccess, ({ payload: { pay } }) => ({
      calculating: false,
      pay,
    })),
    on(membershipRequestDetailsEvents.calculatePayFailure, ({ payload: { error } }) => ({
      calculating: false,
      error,
    })),
    on(
      membershipRequestDetailsEvents.loadSuccess,
      ({ payload: { item, discountAmount, history } }) => ({
        loading: false,
        item,
        discountAmount,
        history,
      }),
    ),
    on(membershipRequestDetailsEvents.loadFailure, ({ payload: { error } }) => ({
      loading: false,
      error,
    })),
  ),
  withEventHandlers(
    (
      state,
      events = inject(Events),
      requestService = inject(RequestService),
      memberService = inject(MemberService),
    ) => {
      // Keep this helper local so both `load$` and `changeStatus$` refresh with identical logic.
      const refreshDetails = ({ campaignId, id }: { campaignId: number; id: number }) =>
        requestService.item(campaignId, +id).pipe(
          switchMap((request) =>
            requestService.history(campaignId, +id).pipe(
              map((history) => {
                const item = {
                  ...request,
                  data: {
                    ...request.data,
                    participants: (request.data['participants'] || []).map(
                      (participant: any, index: number) => ({
                        ...participant,
                        id: index.toString(),
                        member: {
                          status: 'loading',
                          suggestions: [],
                        },
                      }),
                    ),
                  },
                };
                return membershipRequestDetailsEvents.loadSuccess({
                  item: { ...item } as RequestDetails,
                  discountAmount: request.discount_amount || 0,
                  history,
                });
              }),
            ),
          ),
        );

      return {
        load$: events.on(membershipRequestDetailsEvents.load).pipe(
          switchMap(({ payload: { campaignId, id } }) =>
            refreshDetails({ campaignId, id }).pipe(
              mapResponse({
                next: (event) => event,
                error: (error) => membershipRequestDetailsEvents.loadFailure({ error }),
              }),
            ),
          ),
        ),
        loadSuccess$: events.on(membershipRequestDetailsEvents.loadSuccess).pipe(
          switchMap(({ payload: { item } }) => {
            const verificateMembers = item.data.participants.map((participant: any) =>
              memberService
                .exists({
                  firstname: participant['firstname'],
                  lastname: participant['lastname'],
                  birthdate: participant['birthdate'],
                })
                .pipe(
                  map((result) => {
                    return {
                      participantId: participant['id'],
                      result,
                    };
                  }),
                ),
            );
            return merge(...verificateMembers).pipe(
              map((response) =>
                membershipRequestDetailsEvents.setStatusOfMember({
                  participantId: response.participantId,
                  status: response.result.exists
                    ? 'verified'
                    : response.result.suggestions.length > 0
                      ? 'suggested'
                      : 'anonymous',
                  suggestions: response.result.suggestions,
                }),
              ),
            );
          }),
        ),
        setDiscountAmount$: events.on(membershipRequestDetailsEvents.setDiscountAmount).pipe(
          switchMap(({ payload: { discountAmount } }) =>
            requestService
              .update(state.campaignId() || 0, state.id() || 0, {
                discount_amount: discountAmount,
              })
              .pipe(
                mapResponse({
                  next: () => membershipRequestDetailsEvents.setDiscountAmountSuccess(),
                  error: (error) =>
                    membershipRequestDetailsEvents.setDiscountAmountFailure({ error }),
                }),
              ),
          ),
        ),
        refreshPay$: events
          .on(
            membershipRequestDetailsEvents.loadSuccess,
            membershipRequestDetailsEvents.setDiscountAmountSuccess,
          )
          .pipe(
            map(() => {
              const campaignId = state.campaignId();
              const item = state.item();
              const discountAmount = state.discountAmount();
              if (campaignId == null || !item || !item.data) {
                return;
              }
              return membershipRequestDetailsEvents.calculatePay({
                campaignId,
                data: item.data,
                discountAmount,
              });
            }),
          ),
        calculatePay$: events.on(membershipRequestDetailsEvents.calculatePay).pipe(
          switchMap(({ payload: { campaignId, data, discountAmount } }) =>
            requestService.calculatePay(campaignId, data, discountAmount).pipe(
              mapResponse({
                next: (event) => membershipRequestDetailsEvents.calculatePaySuccess({ pay: event }),
                error: (error) => membershipRequestDetailsEvents.calculatePayFailure({ error }),
              }),
            ),
          ),
        ),
        changeStatus$: events.on(membershipRequestDetailsEvents.changeStatus).pipe(
          switchMap(({ payload: { campaignId, id, status, reason } }) => {
            let action$: Observable<any>;
            switch (true) {
              case status === 'approved':
                action$ = requestService.approve(campaignId, +id);
                break;
              case status === 'rejected':
                action$ = requestService.reject(campaignId, +id, reason);
                break;
              case status === 'canceled':
                action$ = requestService.cancel(campaignId, +id);
                break;
              default:
                action$ = requestService.markAsPaid(campaignId, +id);
            }

            return action$.pipe(
              switchMap(() => refreshDetails({ campaignId, id })),
              mapResponse({
                next: (event) => event,
                error: (error) => membershipRequestDetailsEvents.loadFailure({ error }),
              }),
            );
          }),
        ),
      };
    },
  ),
  withHooks({
    onInit(store, dispatcher = inject(Dispatcher), route = inject(ActivatedRoute)) {
      const subscription = combineLatest([of(2), route.params]).subscribe(([value, params]) => {
        dispatcher.dispatch(
          membershipRequestDetailsEvents.load({
            campaignId: value,
            id: params['requestId'],
          }),
        );
      });
      return () => subscription.unsubscribe();
    },
  }),
);
