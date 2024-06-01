export interface Product {
  id: string; // NOTE: String like "0b53e375-28d1-4efc-b1fd-98ded4fbcd20"
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
  discountedCentAmount: number | null;
}

export interface GetAllPublishedProductsRequest {
  limit?: number;
  offset?: number;
  sort?: ProductSort;
  text?: string; // NOTE: The text to analyze and search for
}

export interface GetAllPublishedProductsResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}

export type ProductSort = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';
