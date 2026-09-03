import { Member } from "./member";
import { Session } from "./session";

export type Subscription = {
  id: number;
  license_type: string;
  member_id: number;
  member: Member;
  subscribed_at: number;
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
