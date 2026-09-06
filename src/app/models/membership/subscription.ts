import { Address } from "./address";
import { Member } from "./member";
import { Session } from "./session";

export type Subscription = {
  id: number;
  license_type: string;
  member_id: number;
  member: Member;
  subscribed_at: Date;
  address: Address;
  contacts: {
    id: number;
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
  }[];
  sessions?: Session[];
  campaign_id: number;
};
