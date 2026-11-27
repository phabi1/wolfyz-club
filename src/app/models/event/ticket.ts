export type Ticket = {
  id: number;
  title: string;
  amount: number;
  participant_nb: number;
  participant_max: number;
  member_only: boolean;
  weight: number;
};

export function createEmptyTicket(): Ticket {
  return {
    id: 0,
    title: '',
    amount: 0,
    participant_nb: 0,
    participant_max: 0,
    member_only: false,
    weight: 0,
  };
}

export function fromTicket(ticket: Ticket): any {
  return {
    id: ticket.id,
    title: ticket.title,
    amount: ticket.amount,
    participant_nb: ticket.participant_nb,
    participant_max: ticket.participant_max,
    member_only: ticket.member_only,
    weight: ticket.weight,
  };
}

export function toTicket(data: any): Ticket {
  return {
    id: data.id ?? 0,
    title: data.title ?? '',
    amount: data.amount ?? 0,
    participant_nb: data.participant_nb ?? 0,
    participant_max: data.participant_max ?? 0,
    member_only: data.member_only ?? false,
    weight: data.weight ?? 0,
  };
}