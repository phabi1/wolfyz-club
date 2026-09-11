export type Ticket = {
  id: number;
  title: string;
  amount: number;
  quantity: number;
  member_only: boolean;
};

export function createEmptyTicket(): Ticket {
  return {
    id: 0,
    title: '',
    amount: 0,
    quantity: 0,
    member_only: false,
  };
}

export function fromTicket(ticket: Ticket): any {
  return {
    id: ticket.id,
    title: ticket.title,
    amount: ticket.amount,
    quantity: ticket.quantity,
    member_only: ticket.member_only,
  };
}

export function toTicket(data: any): Ticket {
  return {
    id: data.id ?? 0,
    title: data.title ?? '',
    amount: data.amount ?? 0,
    quantity: data.quantity ?? 0,
    member_only: data.member_only ?? false,
  };
}