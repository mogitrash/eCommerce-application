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
  password: string;
  addresses: BaseAddress[];
  shippingAddressIds?: string[];
  defaultShippingAddressId?: string;
  billingAddressIds?: string[];
  defaultBillingAddressId?: string;
  isEmailVerified: boolean;
  authenticationMode: string;
}

type UpdateFirstNameAction = {
  action: 'setFirstName';
  firstName: string;
};

type UpdateLastNameAction = {
  action: 'setLastName';
  lastName: string;
};

type UpdateDateOfBirthAction = {
  action: 'setDateOfBirth';
  dateOfBirth: string;
};

type UpdateEmailAction = {
  action: 'changeEmail';
  email: string;
};

type UpdateAddressAction = {
  action: 'changeAddress';
  addressId: string;
  address: BaseAddress;
};

type UpdateDefaultShippingAddressAction = {
  action: 'setDefaultShippingAddress';
  addressId: string;
};

type UpdateDefaultBillingAddressAction = {
  action: 'setDefaultBillingAddress';
  addressId: string;
};

type AddAddressAction = {
  action: 'addAddress';
  address: BaseAddress;
};

type AddShippingAddressIdAction = {
  action: 'addShippingAddressId';
  addressKey: string;
};

type AddBillingAddressIdAction = {
  action: 'addBillingAddressId';
  addressKey: string;
};

type RemoveAddressAction = {
  action: 'removeAddress';
  addressId: string;
};

export type CustomerUpdateAction =
  | UpdateFirstNameAction
  | UpdateLastNameAction
  | UpdateDateOfBirthAction
  | UpdateEmailAction
  | UpdateAddressAction
  | UpdateDefaultBillingAddressAction
  | UpdateDefaultShippingAddressAction
  | AddAddressAction
  | AddShippingAddressIdAction
  | AddBillingAddressIdAction
  | RemoveAddressAction;
