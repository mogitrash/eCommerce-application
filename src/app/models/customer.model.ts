import BaseAddress from './base-address.model';

export default interface Customer {
  id: string;
  version: number;
  versionModifiedAt?: string;
  lastMessageSequenceNumber?: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy?: {
    clientId: string;
    isPlatformClient: boolean;
    anonymousId: string;
  };
  createdBy?: {
    clientId: string;
    isPlatformClient: boolean;
    anonymousId: string;
  };
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  addresses: BaseAddress[];
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
  isEmailVerified: boolean;
  authenticationMode: string;
}
