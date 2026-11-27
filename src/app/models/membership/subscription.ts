import { Address } from "./address";
import { Member } from "./member";
import { Session } from "./session";
import { Contact } from "./contact";
import { SubscriptionDiscipline } from "./subscription-discipline";

export type Subscription = {
  id: number;
  license_type: string;
  license_taken_at: Date | null;
  doctor: string | null;
  medical_certificate: string | null;
  medical_certificate_date: Date | null;
  medical_form: string | null;
  identity_photo: string | null;
  agree_exit: boolean | null;
  agree_image: boolean;
  member_id: number;
  member: Member;
  subscribed_at: Date;
  contacts: Contact[];
  fields: Record<string, any>;
  sessions?: Session[];
  disciplines?: SubscriptionDiscipline[];
  campaign_id: number;
};

/** License related data, edited from the license section */
export type SubscriptionLicense = Pick<
  Subscription,
  | 'license_type'
  | 'license_taken_at'
  | 'doctor'
  | 'medical_certificate'
  | 'medical_certificate_date'
  | 'medical_form'
  | 'identity_photo'
  | 'agree_exit'
  | 'agree_image'
>;

export function createEmptySubscription(): Subscription {
  return {
    id: 0,
    license_type: '',
    license_taken_at: null,
    doctor: null,
    medical_certificate: null,
    medical_certificate_date: null,
    medical_form: null,
    identity_photo: null,
    agree_exit: null,
    agree_image: false,
    member_id: 0,
    member: {} as Member,
    subscribed_at: new Date(),
    contacts: [],
    fields: {},
    sessions: [],
    disciplines: [],
    campaign_id: 0,
  };
}
