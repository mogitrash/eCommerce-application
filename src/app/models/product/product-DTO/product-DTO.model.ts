import ProductLocaleInfoDTO from './product-locale-info-DTO.model';
import ProductMasterVariantDTO from './product-master-variant-DTO.model';

export interface ProductDTO {
  name: ProductLocaleInfoDTO;
  description: ProductLocaleInfoDTO;
  masterVariant: ProductMasterVariantDTO;
}
