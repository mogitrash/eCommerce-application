export interface ProductDTO {
  id: string;
  name: ProductLocaleInfoDTO;
  description: ProductLocaleInfoDTO;
  masterVariant: ProductMasterVariantDTO;
}

export interface ProductImageDTO {
  url: string;
  label: string;
}

// NOTE: Only for en-US language
export interface ProductLocaleInfoDTO {
  'en-US': string;
}

export interface ProductMasterVariantDTO {
  id: number;
  attributes: ProductAttributeDTO[];
  images: ProductImageDTO[];
  key: string;
  prices: ProductPriceDTO[];
}

export interface ProductAttributeDTO {
  name: string;
  value: ProductAttributeValueDTO;
}

export interface ProductAttributeValueDTO {
  key: string;
  label: string;
}

export interface ProductPriceDTO {
  id: string;
  value: ProductPriceValueDTO;
  discounted?: ProductDiscountedPriceDTO;
}

export interface ProductDiscountedPriceDTO {
  value: ProductPriceValueDTO;
}

export interface ProductPriceValueDTO {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
}

export type ProductSortDTO = 'name.en-US asc' | 'name.en-US desc' | 'price asc' | 'price desc';

export interface GetAllPublishedProductsRequestDTO {
  limit?: number;
  offset?: number;
  sort?: ProductSortDTO;
  'text.en-US'?: string;
  filter?: string;
}

export interface GetAllPublishedProductsResponseDTO {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductDTO[];
}

export interface GetAllProductsAttributesResponseDTO {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductTypeDTO[];
}

export interface ProductTypeDTO {
  attributes: ProductTypeAttributeDTO[];
}

export interface ProductTypeAttributeDTO {
  name: string;
  label: {
    en: string;
  };
  type: ProductTypeAttributeTypeDTO;
}

export interface ProductTypeAttributeTypeDTO {
  values: ProductTypeAttributeTypeValueDTO[];
}

export interface ProductTypeAttributeTypeValueDTO {
  key: string;
  label: string;
}
