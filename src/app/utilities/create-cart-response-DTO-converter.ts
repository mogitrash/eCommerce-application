import { CreateCartResponseDTO } from '../models/cart/cart-DTO.model';
import { Cart } from '../models/cart/cart.model';
import lineItemDTOConverter from './line-item-DTO-converter';

const createCartResponseDTOConverter = ({
  id,
  totalPrice,
  lineItems,
  version,
}: CreateCartResponseDTO): Cart => ({
  id,
  version,
  totalPrice,
  lineItems: lineItems.map(lineItemDTOConverter),
});

export default createCartResponseDTOConverter;
