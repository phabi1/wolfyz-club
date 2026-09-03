import { RequestParticipant } from "./request-participant";

export type Request = {
  id: number;
  status: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  payed_at: Date;
  data: {
    contact: {
      firstname: string;
      lastname: string;
      email?: string;
      phone?: string;
    };
    participants: RequestParticipant[];
  };
  discount_amount: number;
  campaign_id: number;
};
