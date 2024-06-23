import { CreateCartRequestDTO } from '../models/cart/cart-DTO.model';
import { CreateCartRequest, LineItemDraft } from '../models/cart/cart.model';

const createCartRequestConverter = ({
  currency,
  lineItems = [],
}: CreateCartRequest): CreateCartRequestDTO => {
  const result = { currency, lineItems };

  if (lineItems.length > 0) {
    const resultItems = lineItems.map(
      ({ quantity, productId }): LineItemDraft => ({
        variantID: 1,
        productId,
        quantity: quantity || 1,
      }),
    );

    result.lineItems = resultItems;
  }

  return result;
};

export default createCartRequestConverter;
