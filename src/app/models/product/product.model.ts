export interface Product {
  name: string;
  description: string;
  images: ProductImage[];
  prices: ProductPrice[];
}

export interface ProductImage {
  url: string;
  label: string;
}

export interface ProductPrice {
  id: string;
  centAmount: number;
  currencyCode: string;
}

export interface GetAllPublishedProductsRequest {
  limit?: number;
  offset?: number;
  sort?: ProductSort;
}

export interface GetAllPublishedProductsResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}

export type ProductSort = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';
