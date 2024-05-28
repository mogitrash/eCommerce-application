import { ProductDTO } from '../models/product/product-DTO/product-DTO.model';
import Product from '../models/product/product.model';
import productImageDTOConverter from './product-image-DTO-converter';

const productDTOConverter = ({ name, description, masterVariant }: ProductDTO): Product => ({
  name: name['en-US'],
  description: description['en-US'],
  images: masterVariant.images.map(productImageDTOConverter),
  prices: masterVariant.prices.map((priceDTO) => ({
    id: priceDTO.id,
    centAmount: priceDTO.value.centAmount,
    currencyCode: priceDTO.value.currencyCode,
  })),
});

export default productDTOConverter;
