export interface GetAllCategoriesResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Category[];
}

export interface GetAllCategoriesResquest {
  limit?: number;
  offset?: number;
}

export interface Category {
  id: string;
  key: string;
  name: string;
}
