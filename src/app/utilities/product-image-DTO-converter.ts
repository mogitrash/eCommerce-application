import ProductImageDTO from '../models/product/product-DTO/product-image-DTO.model';
import ProductImage from '../models/product/product-image.model';

const productImageDTOConverter = (productImageDTO: ProductImageDTO): ProductImage => ({
  label: productImageDTO.label,
  url: productImageDTO.url,
});

export default productImageDTOConverter;
