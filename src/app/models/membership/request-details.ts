import type { Request } from './request';

export type RequestDetails = Request & {
  data: {
    contact: {
      email: string;
      phone: string;
      firstname: string;
      lastname: string;
    };
    participants: Array<{
      firstname: string;
      lastname: string;
      birthdate: Date;
      lesson_id: string;
      contacts: Array<{
        email: string;
        phone: string;
        firstname: string;
        lastname: string;
      }>;
      address: {
        line1: string;
        line2: string;
        city: string;
        postal_code: string;
        country: string;
      };
      license_type: string;
      health_questionnaire: string;
      medical_certificate: string;
      identity_photo: string;
      agree_exit: boolean;
      agree_photo: boolean;
      member: {
        status: 'loading' | 'verified' | 'anonymous';
        suggestions: Array<{
          firstname: string;
          lastname: string;
          birthdate: Date;
        }>;
      };
    }>;
  };
};
