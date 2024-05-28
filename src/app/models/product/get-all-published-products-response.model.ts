import { ProductDTO } from './product-DTO/product-DTO.model';

export default interface GetAllPublishedProductsResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductDTO[];
}
