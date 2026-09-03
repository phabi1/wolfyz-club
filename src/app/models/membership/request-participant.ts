import type { Address } from "./address";

export type RequestParticipant = {
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  address?:Address;
  nationality?: string;
  license_type?: 'hobby' | 'competition';
  lesson_id?: string | number;
  lesson_title?: string;
  comment?: string;
  health_questionnaire?: string | null;
  identity_photo?: string | null;
  medical_certificate?: string | null;
  tutor1?: {
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
  };
  tutor2?: {
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
  };
  agree_photo: boolean;
  agree_exit: boolean;
};
