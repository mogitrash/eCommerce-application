import { CreateCartResponseDTO } from '../models/cart/cart-DTO.model';
import {
  Cart,
  CreateCartRequest,
  LineItemDraft,
  LocalStorageCart,
} from '../models/cart/cart.model';
import ErrorResponse from '../models/error-response.model';
import LocalStorageEndpoint from '../models/local-storage-endpoint.model';
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
      localStorage.setItem(
        LocalStorageEndpoint.cart,
        JSON.stringify({
          id: response.id,
          version: response.version,
        }),
      );
      return createCartResponseDTOConverter(response);
    }

    return response;
  }

  async addCartItems(items: LineItemDraft[]): Promise<Cart | ErrorResponse> {
    const cartString = localStorage.getItem(LocalStorageEndpoint.cart);

    // NOTE: creating cart if customer doesn't have one
    if (!cartString) {
      return this.createCart({
        currency: 'EUR',
        lineItems: items,
      });
    }

    const cart: LocalStorageCart = JSON.parse(cartString);

    const body = JSON.stringify({
      version: cart.version,
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
      `${this.clientAPIUrl}/${this.projectKey}/me/carts/${cart.id}`,
      {
        method: 'POST',
        headers,
        body,
      },
    ).then((res) => res.json());

    if ('id' in response) {
      localStorage.setItem(
        LocalStorageEndpoint.cart,
        JSON.stringify({
          id: response.id,
          version: response.version,
        }),
      );
    }

    return response;
  }
}
