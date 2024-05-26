import BaseAddress from './base-address.model';

export default interface Customer {
  id: string;
  version: number;
  versionModifiedAt?: string;
  lastMessageSequenceNumber?: number;
  createdAt: string;
  lastModifiedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  password?: string;
  addresses: BaseAddress[];
  shippingAddressIds?: string[];
  defaultShippingAddressId?: string;
  billingAddressIds?: string[];
  defaultBillingAddressId?: string;
  isEmailVerified: boolean;
  authenticationMode: string;
}
