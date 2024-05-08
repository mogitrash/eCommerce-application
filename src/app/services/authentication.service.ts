// NOTE: We use anonymous session token to authenticate(sign in/ sign up) user
import ErrorResponse from '../models/errorResponse.model';
import SignInResponse from '../models/sign-in-response.model';
import AuthorizationService from './authorization.service';

export default class AuthenticationService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = new AuthorizationService();

  async signUpCustomer(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<SignInResponse | ErrorResponse> {
    const response = await this.authorizationService.getAnonymousSessionToken();

    if ('access_token' in response) {
      const headers = new Headers({
        Authorization: `Bearer ${response.access_token}`,
        'Content-type': 'application/json',
      });

      const body = JSON.stringify({
        email,
        firstName,
        lastName,
        password,
      });

      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/signup`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => res.json());
    }

    return response;
  }

  async signInCustomer(email: string, password: string): Promise<SignInResponse | ErrorResponse> {
    const response = await this.authorizationService.getAnonymousSessionToken();

    if ('access_token' in response) {
      const headers = new Headers({
        Authorization: `Bearer ${response.access_token}`,
        'Content-type': 'application/json',
      });

      const body = JSON.stringify({
        email,
        password,
      });

      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/login`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => res.json());
    }

    return response;
  }
}
