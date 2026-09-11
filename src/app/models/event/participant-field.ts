export type ParticipantField = {
  id: number;
  label: string;
  type: string;
  description?: string;
  required: boolean;
  options?: string[];
  member_only: boolean;
  tickets: string[];
};

export function createEmptyParticipantField(): ParticipantField {
  return {
    id: 0,
    label: '',
    type: '',
    description: '',
    required: false,
    options: [],
    member_only: false,
    tickets: [],
  };
}

export function fromParticipantField(field: ParticipantField): any {
  return {
    id: field.id,
    label: field.label,
    type: field.type,
    description: field.description,
    required: field.required,
    options: field.options,
    member_only: field.member_only,
    tickets: field.tickets,
  };
}

export function toParticipantField(data: any): ParticipantField {
  return {
    id: data.id ?? 0,
    label: data.label ?? '',
    type: data.type ?? '',
    description: data.description ?? '',
    required: data.required ?? false,
    options: data.options ?? [],
    member_only: data.member_only ?? false,
    tickets: data.tickets ?? [],
  };
}
