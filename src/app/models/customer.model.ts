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
  dateOfBirth: string;
  password?: string;
  addresses: BaseAddress[];
  shippingAddressIds?: string[];
  defaultShippingAddressId?: string;
  billingAddressIds?: string[];
  defaultBillingAddressId?: string;
  isEmailVerified: boolean;
  authenticationMode: string;
}

export type UpdateFirstNameAction = {
  action: 'setFirstName';
  firstName: string;
};

export type UpdateLastNameAction = {
  action: 'setLastName';
  lastName: string;
};

export type UpdateDateOfBirthAction = {
  action: 'setDateOfBirth';
  dateOfBirth: string;
};

export type UpdateAddressAction = {
  action: 'changeAddress';
  addressId: string;
  address: BaseAddress;
};

export type CustomerUpdateAction =
  | UpdateFirstNameAction
  | UpdateLastNameAction
  | UpdateDateOfBirthAction
  | UpdateAddressAction;
