import { GetAllPublishedProductsResponseDTO } from '../models/product/product-DTO.model';
import { GetAllPublishedProductsRequest } from '../models/product/product.model';
import getAllPublishedProductsRequestConverter from '../utilities/get-all-published-products-request-converter';
import AuthorizationService from './authorization.service';

export default class ProductService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = new AuthorizationService();

  async getAllPublishedProducts(
    parameters: GetAllPublishedProductsRequest = {},
  ): Promise<GetAllPublishedProductsResponseDTO> {
    let token = localStorage.getItem('userToken');

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
    ).then((res) => res.json());
  }
}
