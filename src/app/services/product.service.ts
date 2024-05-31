import { GetAllPublishedProductsResponseDTO } from '../models/product/product-DTO.model';
import { GetAllPublishedProductsRequest, Product } from '../models/product/product.model';
import getAllPublishedProductsRequestConverter from '../utilities/get-all-published-products-request-converter';
import getCurrentAccessToken from '../utilities/get-current-access-token';
import productDTOConverter from '../utilities/product-DTO-converter';
import authorizationService from './authorization.service';

export default class ProductService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = authorizationService;

  async getAllPublishedProducts(
    parameters: GetAllPublishedProductsRequest = {},
  ): Promise<GetAllPublishedProductsResponseDTO> {
    const token = await getCurrentAccessToken();

    const queryParameters = new URLSearchParams(
      Object.entries(getAllPublishedProductsRequestConverter(parameters)),
    );

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(
      `${this.clientAPIUrl}/${this.projectKey}/product-projections/search?${queryParameters}`,
      {
        method: 'GET',
        headers,
      },
    ).then((res) => res.json());
  }

  async getPublishedProductById(id: string): Promise<Product> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(`${this.clientAPIUrl}/${this.projectKey}/product-projections/${id}`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then(productDTOConverter);
  }
}
