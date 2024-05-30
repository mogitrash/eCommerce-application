import { GetAllPublishedProductsRequestDTO } from '../models/product/product-DTO.model';
import { GetAllPublishedProductsRequest } from '../models/product/product.model';
import productSortConverter from './product-sort-converter';

const getAllPublishedProductsRequestConverter = ({
  limit,
  offset,
  sort,
}: GetAllPublishedProductsRequest): GetAllPublishedProductsRequestDTO => {
  const requestDTO: GetAllPublishedProductsRequestDTO = {};

  if (limit) {
    requestDTO.limit = limit;
  }

  if (offset) {
    requestDTO.offset = offset;
  }

  if (sort) {
    requestDTO.sort = productSortConverter(sort);
  }

  return requestDTO;
};

export default getAllPublishedProductsRequestConverter;
