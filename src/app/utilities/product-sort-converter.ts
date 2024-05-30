import { ProductSortDTO } from '../models/product/product-DTO.model';
import { ProductSort } from '../models/product/product.model';

const productSortConverter = (sort: ProductSort): ProductSortDTO => {
  switch (sort) {
    case 'nameAsc':
      return 'name.en-US asc';
    case 'nameDesc':
      return 'name.en-US desc';
    case 'priceAsc':
      return 'price asc';
    case 'priceDesc':
      return 'price desc';
    default:
      return 'name.en-US asc';
  }
};

export default productSortConverter;
