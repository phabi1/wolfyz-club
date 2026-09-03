import type { Subscription } from '../../../../../../models/membership/subscription';

export type SubscriptionContact = Subscription['contacts'][number];

export type EditableContact = {
  key: string;
  id: number | null;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

export type EditableSession = {
  key: string;
  id: number | null;
  lesson_id: number | null;
  subscription_id: number | null;
};
