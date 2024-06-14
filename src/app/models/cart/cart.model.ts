import { ProductImage } from '../product/product.model';

export interface Cart {
  id: string;
  version: number;
  totalPrice: CartPrice;
  lineItems: LineItem[];
}

export interface CreateCartRequest {
  currency: string;
  lineItems?: LineItemDraft[];
}

export interface CartPrice {
  currencyCode: string;
  centAmount: number;
}

export interface LineItem {
  id: string; // NOTE: line item ID, not product ID
  productId: string;
  name: string;
  price: LineItemPrice;
  quantity: number;
  totalPrice: LineItemPrice;
  images: ProductImage[];
}

export interface LineItemPrice {
  centAmount: number;
  currencyCode: string;
  discountedCentAmount: number | null;
}

export interface LineItemDraft {
  productId: string;
  // NOTE: will set to 1 by default, cause we have only 1 variant of each product
  variantID?: number;
  quantity?: number;
}

export interface LocalStorageCart {
  id: string;
  version: number;
}
