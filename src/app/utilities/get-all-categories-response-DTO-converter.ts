import { GetAllCategoriesResponseDTO } from '../models/category/category-DTO.model';
import { GetAllCategoriesResponse } from '../models/category/category.model';
import categoryDTOConverter from './category-DTO-converter';

const getAllCategoriesResponseDTOConverter = ({
  limit,
  offset,
  results,
  count,
  total,
}: GetAllCategoriesResponseDTO): GetAllCategoriesResponse => ({
  limit,
  offset,
  count,
  total,
  results: results.map(categoryDTOConverter),
});

export default getAllCategoriesResponseDTOConverter;
