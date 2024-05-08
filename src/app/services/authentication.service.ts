// NOTE: We use anonymous session token to authenticate(sign in/ sign up) user
import CustomerDraft from '../models/customer-draft.model';
import CustomerSignIn from '../models/customer-sign-in.model';
import ErrorResponse from '../models/error-response.model';
import SignInResponse from '../models/sign-in-response.model';
import AuthorizationService from './authorization.service';

export default class AuthenticationService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = new AuthorizationService();

  async signUpCustomer(customerDraft: CustomerDraft): Promise<SignInResponse | ErrorResponse> {
    return this.makeAuthRequest(customerDraft, 'signup');
  }

  async signInCustomer(customerSignIn: CustomerSignIn): Promise<SignInResponse | ErrorResponse> {
    return this.makeAuthRequest(customerSignIn, 'login');
  }

  private async makeAuthRequest(
    data: CustomerSignIn | CustomerDraft,
    endPoint: 'login' | 'signup',
  ): Promise<SignInResponse | ErrorResponse> {
    const response = await this.authorizationService.getAnonymousSessionToken();

    if ('access_token' in response) {
      const headers = new Headers({
        Authorization: `Bearer ${response.access_token}`,
        'Content-type': 'application/json',
      });

      const body = JSON.stringify(data);

      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/${endPoint}`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => res.json());
    }

    return response;
  }
}
