import {
  Category,
  GetAllCategoriesResponse,
  GetAllCategoriesResquest,
} from '../models/category/category.model';
import categoryDTOConverter from '../utilities/category-DTO-converter';
import getAllCategoriesResponseDTOConverter from '../utilities/get-all-categories-response-DTO-converter';
import getCurrentAccessToken from '../utilities/get-current-access-token';

export default class CategoryService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private baseUrl = `${this.clientAPIUrl}/${this.projectKey}/categories`;

  async getAllCategories(
    parameters: GetAllCategoriesResquest = {},
  ): Promise<GetAllCategoriesResponse> {
    const token = await getCurrentAccessToken();

    const queryParameters = new URLSearchParams(Object.entries(parameters));

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(`${this.baseUrl}?${queryParameters}`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then(getAllCategoriesResponseDTOConverter);
  }

  async getCategoryById(id: string): Promise<Category> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then(categoryDTOConverter);
  }
}
