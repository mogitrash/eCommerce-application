import { GetAllProductsAttributesResponseDTO } from '../models/product/product-DTO.model';
import { GetAllProductsAttributesResponse } from '../models/product/product.model';

const getAllProductsAttributesResponseDTOConverter = ({
  results,
}: GetAllProductsAttributesResponseDTO): GetAllProductsAttributesResponse => {
  const { attributes } = results[0];
  const result: GetAllProductsAttributesResponse = {};

  attributes.forEach((attribute) => {
    result[attribute.name] = attribute.type.values;
  });

  return result;
};

export default getAllProductsAttributesResponseDTOConverter;
