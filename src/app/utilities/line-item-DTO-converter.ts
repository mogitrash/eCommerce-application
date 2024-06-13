import { LineItemDTO } from '../models/cart/cart-DTO.model';
import { LineItem } from '../models/cart/cart.model';

const lineItemDTOConverter = ({
  id,
  name,
  price,
  quantity,
  totalPrice,
}: LineItemDTO): LineItem => ({
  id,
  name: name['en-US'],
  quantity,
  price: {
    centAmount: price.value.centAmount,
    currencyCode: price.value.currencyCode,
    discountedCentAmount: price.discounted?.value.centAmount || null,
  },
  totalPrice: {
    centAmount: totalPrice.centAmount,
    currencyCode: totalPrice.currencyCode,
    discountedCentAmount: null,
  },
});

export default lineItemDTOConverter;
