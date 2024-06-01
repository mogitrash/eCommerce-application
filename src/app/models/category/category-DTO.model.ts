export interface GetAllCategoriesResponseDTO {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: CategoryDTO[];
}

export interface CategoryDTO {
  id: string;
  key: string;
  name: CategoryLocaleInfoDTO;
}

export interface CategoryLocaleInfoDTO {
  'en-US': string;
}
