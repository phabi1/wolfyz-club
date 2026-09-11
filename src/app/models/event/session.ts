export type Session = {
  id: number;
  title: string;
  description: string;
  session_start: Date;
  session_end: Date;
};

export function createEmptySession(): Session {
  return {
    id: 0,
    title: '',
    description: '',
    session_start: new Date(),
    session_end: new Date(),
  };
}

export function fromSession(session: Session): any {
  return {
    id: session.id,
    title: session.title,
    description: session.description,
    session_start: session.session_start.getTime(),
    session_end: session.session_end.getTime(),
  };
}

export function toSession(data: any): Session {
  return {
    id: data.id ?? 0,
    title: data.title ?? '',
    description: data.description ?? '',
    session_start: new Date(data.session_start ?? Date.now()),
    session_end: new Date(data.session_end ?? Date.now()),
  };
}