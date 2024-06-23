import { GetAllPublishedProductsResponseDTO } from '../models/product/product-DTO.model';
import { GetAllPublishedProductsResponse } from '../models/product/product.model';
import productDTOConverter from './product-DTO-converter';

const GetAllPublishedProductsDTOResponseConverter = (
  responseDTO: GetAllPublishedProductsResponseDTO,
): GetAllPublishedProductsResponse => ({
  ...responseDTO,
  results: responseDTO.results.map(productDTOConverter),
});

export default GetAllPublishedProductsDTOResponseConverter;
