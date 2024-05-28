import ProductImageDTO from './product-DTO/product-image-DTO.model';
import ProductPrice from './product-price.model';

export default interface Product {
  name: string;
  description: string;
  images: ProductImageDTO[];
  prices: ProductPrice[];
}
