import Customer, { CustomerUpdateAction } from '../models/customer.model';
import LocalStorageEndpoint from '../models/local-storage-endpoint.model';

export default class ProfileService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private baseUrl: string = `${this.clientAPIUrl}/${this.projectKey}/me`;

  async getUserProfile(): Promise<Customer> {
    const accessToken = localStorage.getItem(LocalStorageEndpoint.userToken);
    const headers = new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    });
    return fetch(this.baseUrl, {
      method: 'GET',
      headers,
    }).then((res) => res.json());
  }

  async updateUserProfile(version: number, action: CustomerUpdateAction): Promise<Customer> {
    const accessToken = localStorage.getItem('userToken');
    const headers = new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    });
    const body = JSON.stringify({ version, actions: [action] });
    return fetch(this.baseUrl, {
      method: 'POST',
      headers,
      body,
    }).then((res) => res.json());
  }
}
