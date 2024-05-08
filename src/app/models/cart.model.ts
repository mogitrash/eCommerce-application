export default interface Cart {
  type: string;
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  lineItems: string[]; // NOTE: need interface
  cartState: string;
  totalPrice: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  shippingMode: string;
  shipping: string[]; // NOTE: need interface
  customLineItems: string[]; // NOTE: need interface
  discountCodes: string[]; // NOTE: need interface
  directDiscounts: string[]; // NOTE: need interface
  inventoryMode: string;
  taxMode: string;
  taxRoundingMode: string;
  taxCalculationMode: string;
  deleteDaysAfterLastModification: number;
  refusedGifts: string[]; // NOTE: need interface
  origin: string;
  itemShippingAddresses: string[]; // NOTE: need interface
}
