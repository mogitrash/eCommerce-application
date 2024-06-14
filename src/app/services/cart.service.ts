import { CreateCartResponseDTO } from '../models/cart/cart-DTO.model';
import { Cart, CreateCartRequest, LineItemDraft } from '../models/cart/cart.model';
import ErrorResponse from '../models/error-response.model';
import createCartRequestConverter from '../utilities/create-cart-request-converter';
import createCartResponseDTOConverter from '../utilities/create-cart-response-DTO-converter';
import getCurrentAccessToken from '../utilities/get-current-access-token';

export default class CartService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  async createCart(
    request: CreateCartRequest = { currency: 'EUR' },
  ): Promise<ErrorResponse | Cart> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const body = JSON.stringify(createCartRequestConverter(request));

    const response: CreateCartResponseDTO | ErrorResponse = await fetch(
      `${this.clientAPIUrl}/${this.projectKey}/me/carts`,
      {
        method: 'POST',
        headers,
        body,
      },
    ).then((res) => res.json());

    if ('id' in response) {
      return createCartResponseDTOConverter(response);
    }

    return response;
  }

  async getActiveCustomerCart(): Promise<Cart | ErrorResponse> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const response: CreateCartResponseDTO | ErrorResponse = await fetch(
      `${this.clientAPIUrl}/${this.projectKey}/me/active-cart`,
      {
        headers,
      },
    ).then((res) => res.json());

    if ('id' in response) {
      return createCartResponseDTOConverter(response);
    }

    return response;
  }

  async addCartItems(items: LineItemDraft[]): Promise<Cart | ErrorResponse> {
    const activeCart = await this.getActiveCustomerCart();

    if ('message' in activeCart) {
      return this.createCart({
        currency: 'EUR',
        lineItems: items,
      });
    }

    const body = JSON.stringify({
      version: activeCart.version,
      actions: [
        ...items.map((item) => ({
          action: 'addLineItem',
          productId: item.productId,
          variantId: item.variantID,
          quantity: item.quantity || 1,
        })),
      ],
    });

    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const response: Cart | ErrorResponse = await fetch(
      `${this.clientAPIUrl}/${this.projectKey}/me/carts/${activeCart.id}`,
      {
        method: 'POST',
        headers,
        body,
      },
    ).then((res) => res.json());

    return response;
  }

  // NOTE: if quantity is absence remove whole item from cart
  async removeCartItem(productId: string, quantity?: number) {
    const activeCart = await this.getActiveCustomerCart();

    if ('message' in activeCart) {
      return activeCart;
    }

    const body = JSON.stringify({
      version: activeCart.version,
      actions: [
        {
          action: 'removeLineItem',
          lineItemId: activeCart.lineItems.find((item) => item.productId === productId)?.id,
          quantity,
        },
      ],
    });

    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const response: Cart | ErrorResponse = await fetch(
      `${this.clientAPIUrl}/${this.projectKey}/me/carts/${activeCart.id}`,
      {
        method: 'POST',
        headers,
        body,
      },
    ).then((res) => res.json());

    return response;
  }

  async isProductInActiveCart(productId: string) {
    const activeCart = await this.getActiveCustomerCart();

    if ('id' in activeCart) {
      return activeCart.lineItems.some((item) => item.productId === productId);
    }

    return activeCart;
  }
}
