import { Address } from "./address";

export type Member = {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  license_number?: string;
  gender?: "male" | "female";
  avatar_url?: string;
  address: Address;
  email?: string;
  phone?: string;
};
