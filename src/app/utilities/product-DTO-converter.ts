import { ProductDTO } from '../models/product/product-DTO.model';
import { Product } from '../models/product/product.model';
import productImageDTOConverter from './product-image-DTO-converter';

const productDTOConverter = ({ id, name, description, masterVariant }: ProductDTO): Product => ({
  id,
  name: name['en-US'],
  description: description['en-US'],
  images: masterVariant.images.map(productImageDTOConverter),
  prices: masterVariant.prices.map((priceDTO) => ({
    id: priceDTO.id,
    centAmount: priceDTO.value.centAmount,
    currencyCode: priceDTO.value.currencyCode,
    discountedCentAmount: priceDTO.discounted?.value.centAmount || null,
  })),
});

export default productDTOConverter;
