import type { Subscription } from '../../../../../models/membership/subscription';

export type SubscriptionContact = Subscription['contacts'][number];

export type EditableContact = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  owner: boolean;
};

export type EditableSession = {
  id: number;
  lesson_id: number;
};
