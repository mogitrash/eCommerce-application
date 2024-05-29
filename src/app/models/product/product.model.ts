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
