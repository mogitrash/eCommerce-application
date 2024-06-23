import { ProductImageDTO } from '../models/product/product-DTO.model';
import { ProductImage } from '../models/product/product.model';

const productImageDTOConverter = (productImageDTO: ProductImageDTO): ProductImage => ({
  label: productImageDTO.label,
  url: productImageDTO.url,
});

export default productImageDTOConverter;
