import { ProductDTO } from '../models/product/product-DTO/product-DTO.model';
import Product from '../models/product/product.model';
import productImageDTOConverter from './product-image-DTO-converter';

const productDTOConverter = (productDTO: ProductDTO): Product => ({
  name: productDTO.name['en-US'],
  description: productDTO.description['en-US'],
  images: productDTO.masterVariant.images.map(productImageDTOConverter),
});

export default productDTOConverter;
