import ErrorResponse from '../models/error-response.model';
import { ProductDTO } from '../models/product/product-DTO.model';
import {
  GetAllProductsAttributesResponse,
  GetAllPublishedProductsRequest,
  GetAllPublishedProductsResponse,
  Product,
} from '../models/product/product.model';
import getAllProductsAttributesResponseDTOConverter from '../utilities/get-all-products-attributes-response-DTO-converter';
import getAllPublishedProductsRequestConverter from '../utilities/get-all-published-products-request-converter';
import GetAllPublishedProductsDTOResponseConverter from '../utilities/get-all-published-products-response-DTO-converter';
import getCurrentAccessToken from '../utilities/get-current-access-token';
import productDTOConverter from '../utilities/product-DTO-converter';

export default class ProductService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  async getAllPublishedProducts(
    parameters: GetAllPublishedProductsRequest = {},
  ): Promise<GetAllPublishedProductsResponse> {
    const token = await getCurrentAccessToken();

    const queryParameters = new URLSearchParams(
      Object.entries(getAllPublishedProductsRequestConverter(parameters)),
    );

    // NOTE: Filters need to be handled separately from other params
    if (parameters.filter) {
      parameters.filter.forEach((filterQuery) => queryParameters.append('filter', filterQuery));
    }

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

  async getPublishedProductById(id: string): Promise<Product | ErrorResponse> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const response: ProductDTO | ErrorResponse = await fetch(
      `${this.clientAPIUrl}/${this.projectKey}/product-projections/${id}`,
      {
        method: 'GET',
        headers,
      },
    ).then((res) => res.json());

    if ('id' in response) {
      return productDTOConverter(response);
    }

    return response;
  }

  async getAllProductsAttributes(): Promise<GetAllProductsAttributesResponse> {
    const token = await getCurrentAccessToken();

    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    return fetch(`${this.clientAPIUrl}/${this.projectKey}/product-types`, {
      method: 'GET',
      headers,
    })
      .then((res) => res.json())
      .then(getAllProductsAttributesResponseDTOConverter);
  }

  static generateBrandFilterQuery(brandKey: string) {
    return `variants.attributes.brand.key:"${brandKey}"`;
  }

  static generateColorFilterQuery(colorKey: string) {
    return `variants.attributes.color.key:"${colorKey}"`;
  }

  static generateCategoryFilterQuery(colorKey: string) {
    return `variants.attributes.color.key:"${colorKey}"`;
  }

  static generatePriceFilterQuery(id: string) {
    return `categories.id:"${id}"`;
  }
}
