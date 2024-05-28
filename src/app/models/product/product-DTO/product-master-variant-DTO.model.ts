import ProductImageDTO from './product-image-DTO.model';
import ProductPriceDTO from './product-price-DTO.model';

export default interface ProductMasterVariantDTO {
  id: number;
  images: ProductImageDTO[];
  key: string;
  prices: ProductPriceDTO[];
}
