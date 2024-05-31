import { ProductDTO } from '../models/product/product-DTO.model';
import { Product } from '../models/product/product.model';
import productImageDTOConverter from './product-image-DTO-converter';

const productDTOConverter = ({ id, name, description, masterVariant }: ProductDTO): Product => ({
  id,
  name: name['en-US'],
  description: description['en-US'],
  images: masterVariant.images.map(productImageDTOConverter),
  attributes: masterVariant.attributes.map((attributeDTO) => ({
    name: attributeDTO.name,
    key: attributeDTO.value.key,
    label: attributeDTO.value.label,
  })),
  prices: masterVariant.prices.map((priceDTO) => ({
    id: priceDTO.id,
    centAmount: priceDTO.value.centAmount,
    currencyCode: priceDTO.value.currencyCode,
  })),
});

export default productDTOConverter;
