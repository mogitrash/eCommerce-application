import LocalStorageEndpoint from '../models/local-storage-endpoint.model';
import {
  GetAllPublishedProductsRequest,
  GetAllPublishedProductsResponse,
  Product,
} from '../models/product/product.model';
import getAllPublishedProductsRequestConverter from '../utilities/get-all-published-products-request-converter';
import GetAllPublishedProductsDTOResponseConverter from '../utilities/get-all-published-products-response-DTO-converter';
import productDTOConverter from '../utilities/product-DTO-converter';
import authorizationService from './authorization.service';

export default class ProductService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = authorizationService;

  async getAllPublishedProducts(
    parameters: GetAllPublishedProductsRequest = {},
  ): Promise<GetAllPublishedProductsResponse> {
    let token = localStorage.getItem(LocalStorageEndpoint.userToken);

    // TODO: implement token refreshing
    if (!token) {
      const authorizationResponse = await this.authorizationService.getAnonymousSessionToken();
      if ('access_token' in authorizationResponse) {
        token = authorizationResponse.access_token;
      }
    }

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
    )
      .then((res) => res.json())
      .then(GetAllPublishedProductsDTOResponseConverter);
  }

  async getPublishedProductById(id: string): Promise<Product> {
    let token = localStorage.getItem(LocalStorageEndpoint.userToken);

    if (!token) {
      const authorizationResponse = await this.authorizationService.getAnonymousSessionToken();
      if ('access_token' in authorizationResponse) {
        token = authorizationResponse.access_token;
      }
    }

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
