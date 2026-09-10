import { type Address, createEmptyAddress } from "./address";

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

export function createEmptyMember(): Member {
  return {
    id: 0,
    firstname: '',
    lastname: '',
    birthdate: '',
    license_number: undefined,
    gender: undefined,
    avatar_url: undefined,
    address: createEmptyAddress(),
    email: undefined,
    phone: undefined,
  };
}