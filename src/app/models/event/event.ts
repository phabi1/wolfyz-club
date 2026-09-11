import { toDate, toTimestamp } from '../../utils/date';
import { ParticipantField, toParticipantField } from './participant-field';
import { Session, toSession } from './session';
import { Ticket, toTicket } from './ticket';

export type Event = {
  id: number;
  title: string;
  participant_max: number;
  participant_nb: number;
  description: string;
  event_start: Date;
  event_end: Date;
  registration_start: Date | null;
  registration_end: Date | null;
  tickets?: Ticket[];
  participant_fields?: ParticipantField[];
  sessions?: Session[];
};

export function createEmptyEvent(): Event {
  return {
    id: 0,
    title: '',
    participant_max: 0,
    participant_nb: 0,
    description: '',
    event_start: new Date(),
    event_end: new Date(),
    registration_start: null,
    registration_end: null,
    tickets: [],
    participant_fields: [],
    sessions: [],
  };
}

export function fromEvent(event: Partial<Event>): any {
  return {
    id: event.id,
    title: event.title,
    participant_max: event.participant_max,
    participant_nb: event.participant_nb,
    description: event.description,
    event_start: event.event_start ? toTimestamp(event.event_start) : undefined,
    event_end: event.event_end ? toTimestamp(event.event_end) : undefined,
    registration_start: event.registration_start ? toTimestamp(event.registration_start) : null,
    registration_end: event.registration_end ? toTimestamp(event.registration_end) : null,
  };
}

export function toEvent(data: any): Event {
  return {
    id: data.id ?? 0,
    title: data.title ?? '',
    participant_max: data.participant_max ?? 0,
    participant_nb: data.participant_nb ?? 0,
    description: data.description ?? '',
    event_start: toDate(data.event_start),
    event_end: toDate(data.event_end),
    registration_start: data.registration_start ? toDate(data.registration_start) : null,
    registration_end: data.registration_end ? toDate(data.registration_end) : null,
    tickets: (data.tickets ?? []).map((ticket: any) => toTicket(ticket)),
    participant_fields: (data.participant_fields ?? []).map((field: any) =>
      toParticipantField(field),
    ),
    sessions: (data.sessions ?? []).map((session: any) => toSession(session)),
  };
}
