import { GetAllPublishedProductsRequestDTO } from '../models/product/product-DTO.model';
import { GetAllPublishedProductsRequest } from '../models/product/product.model';
import productSortConverter from './product-sort-converter';

const getAllPublishedProductsRequestConverter = ({
  limit,
  offset,
  sort,
  text,
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

  if (text) {
    requestDTO['text.en-US'] = text;
  }

  return requestDTO;
};

export default getAllPublishedProductsRequestConverter;
