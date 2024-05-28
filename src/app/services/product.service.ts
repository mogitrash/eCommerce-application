import GetAllPublishedProductsRequest from '../models/product/get-all-published-products-request.model';
import GetAllPublishedProductsResponse from '../models/product/get-all-published-products-response.model';
import Product from '../models/product/product.model';
import productConverterDTO from '../utilities/product-DTO-converter';
import AuthorizationService from './authorization.service';

export default class ProductService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = new AuthorizationService();

  async getAllPublishedProducts(
    parameters: GetAllPublishedProductsRequest = {},
  ): Promise<Product[]> {
    let token = localStorage.getItem('userToken');

    if (!token) {
      const authorizationResponse = await this.authorizationService.getAnonymousSessionToken();
      if ('access_token' in authorizationResponse) {
        token = authorizationResponse.access_token;
      }
    }

    const queryParameters = new URLSearchParams(Object.entries(parameters));

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(`${this.clientAPIUrl}/${this.projectKey}/product-projections?${queryParameters}`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then((json: GetAllPublishedProductsResponse) => json.results.map(productConverterDTO));
  }
}
