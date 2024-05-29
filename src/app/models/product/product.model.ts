export interface Product {
  name: string;
  description: string;
  images: ProductImage[];
}

export interface ProductImage {
  url: string;
  label: string;
}
