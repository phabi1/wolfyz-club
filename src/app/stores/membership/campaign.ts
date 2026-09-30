import { eventGroup, on, withReducer } from '@ngrx/signals/events';
import { signalStore, type, withState } from '@ngrx/signals';

type CampaignState = {
  campaignId: number | null;
};

export const membershipCampaignEvent = eventGroup({
  source: 'Membership Campaign',
  events: {
    select: type<number>(),
  },
});

export const MembershipCampaignStore = signalStore(
  { providedIn: 'root' },
  withState<CampaignState>({
    campaignId: null,
  }),
  withReducer(
    on(membershipCampaignEvent.select, ({ payload }) => ({
      campaignId: payload,
    })),
  ),
);
