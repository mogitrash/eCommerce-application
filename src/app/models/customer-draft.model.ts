import BaseAddress from './base-address.model';

export default interface CustomerDraft {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  salutation?: string;
  dateOfBirth?: Date;
  companyName?: string;
  vatId?: string;
  addresses?: BaseAddress[];
  defaultShippingAddress?: number; // NOTE: Index of the address in the addresses array
  defaultBillingAddress?: number; // NOTE: Index of the address in the addresses array
  locale?: string;
  stores?: string[]; // NOTE: need StoreResourceIdentifier interface
}
