import { Address } from "./address";
import { Member } from "./member";
import { Session } from "./session";
import { Contact } from "./contact";

export type Subscription = {
  id: number;
  license_type: string;
  license_taken_at: Date | null;
  member_id: number;
  member: Member;
  subscribed_at: Date;
  contacts: Contact[];
  fields: Record<string, any>;
  sessions?: Session[];
  campaign_id: number;
};

export function createEmptySubscription(): Subscription {
  return {
    id: 0,
    license_type: '',
    license_taken_at: null,
    member_id: 0,
    member: {} as Member,
    subscribed_at: new Date(),
    contacts: [],
    fields: {},
    sessions: [],
    campaign_id: 0,
  };
}