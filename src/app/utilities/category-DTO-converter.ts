import { CategoryDTO } from '../models/category/category-DTO.model';
import { Category } from '../models/category/category.model';

const categoryDTOConverter = ({ id, key, name }: CategoryDTO): Category => ({
  id,
  key,
  name: name['en-US'],
});

export default categoryDTOConverter;
