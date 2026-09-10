export type Address = {
  line1: string;
  line2: string;
  city: string;
  zipcode: string;
  country: string;
};

export function createEmptyAddress(): Address {
  return {
    line1: "",
    line2: "",
    city: "",
    zipcode: "",
    country: "",
  };
}
