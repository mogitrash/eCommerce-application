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
  images: ProductImageDTO[];
  key: string;
  prices: ProductPriceDTO[];
}

export interface ProductPriceDTO {
  id: string;
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
}

export interface GetAllPublishedProductsResponseDTO {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductDTO[];
}
