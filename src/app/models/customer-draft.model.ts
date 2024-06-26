import BaseAddress from './base-address.model';

export default interface CustomerDraft {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  addresses: BaseAddress[];
  defaultShippingAddress?: number; // NOTE: Index of the address in the addresses array
  defaultBillingAddress?: number; // NOTE: Index of the address in the addresses array
  shippingAddresses?: [number]; // NOTE: Indices of the address in the addresses array
  billingAddresses?: [number]; // NOTE: Indices of the address in the addresses array
}
