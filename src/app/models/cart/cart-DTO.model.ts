import { LineItemDraft } from './cart.model';

export interface CreateCartResponseDTO {
  type: 'Cart';
  version: number;
  id: string;
  totalPrice: CartPriceDTO;
  lineItems: LineItemDTO[];
}

export interface CreateCartRequestDTO {
  currency: string;
  lineItems?: LineItemDraft[];
}

export interface CartPriceDTO {
  currencyCode: string;
  centAmount: number;
}

export interface LineItemDTO {
  id: string; // NOTE: line item ID, not product ID
  name: LineItemNameDTO;
  price: LineItemPriceDTO;
  quantity: number;
  totalPrice: LineItemPriceValueDTO;
}

export interface LineItemNameDTO {
  'en-US': string;
}

export interface LineItemPriceDTO {
  id: string;
  value: LineItemPriceValueDTO;
  discounted?: LineItemDiscountedPriceDTO;
}

export interface LineItemPriceValueDTO {
  currencyCode: string;
  centAmount: number;
}

export interface LineItemDiscountedPriceDTO {
  value: LineItemPriceValueDTO;
}

export interface AddLineItemRequestDTO {
  version: number;
  actions: AddLineItemActionDTO[];
}

export interface AddLineItemActionDTO extends UpdateCartAction {
  productId: string;
  variantId?: number;
  quantity?: number;
}

export interface UpdateCartAction {
  action: string;
}
