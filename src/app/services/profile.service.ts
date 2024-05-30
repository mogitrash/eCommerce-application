import Customer from '../models/customer.model';
import LocalStorageEndpoint from '../models/local-storage-endpoint.model';

export default class ProfileService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  async getUserProfile(): Promise<Customer> {
    const accessToken = localStorage.getItem(LocalStorageEndpoint.userToken);
    const headers = new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    });
    return fetch(`${this.clientAPIUrl}/${this.projectKey}/me`, {
      method: 'GET',
      headers,
    }).then((res) => res.json());
  }
}
