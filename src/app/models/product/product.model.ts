import ProductImageDTO from './product-DTO/product-image-DTO.model';

export default interface Product {
  name: string;
  description: string;
  images: ProductImageDTO[];
}
