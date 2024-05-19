// NOTE: We use anonymous session token to authenticate(sign in/ sign up) user
import CustomerDraft from '../models/customer-draft.model';
import CustomerSignIn from '../models/customer-sign-in.model';
import ErrorResponse from '../models/error-response.model';
import SignInResult from '../models/sign-in-result.model';
import AuthorizationService from './authorization.service';

export default class AuthenticationService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private authorizationService = new AuthorizationService();

  async signUpCustomer(customerDraft: CustomerDraft): Promise<SignInResult | ErrorResponse> {
    return this.makeAuthRequest(customerDraft, 'signup');
  }

  async signInCustomer(customerSignIn: CustomerSignIn): Promise<SignInResult | ErrorResponse> {
    return this.makeAuthRequest(customerSignIn, 'login');
  }

  private async makeAuthRequest(
    data: CustomerSignIn | CustomerDraft,
    endPoint: 'login' | 'signup',
  ): Promise<SignInResult | ErrorResponse> {
    let authorizationResponse;
    const isLogin = endPoint === 'login';

    if (isLogin) {
      authorizationResponse = await this.authorizationService.getAnonymousSessionToken();
    } else {
      authorizationResponse = await this.authorizationService.getPasswordFlowToken(
        data.email,
        data.password,
      );
    }

    if ('access_token' in authorizationResponse) {
      const headers = new Headers({
        Authorization: `Bearer ${authorizationResponse.access_token}`,
        'Content-type': 'application/json',
      });

      if (isLogin) {
        localStorage.setItem('userToken', authorizationResponse.access_token);
      }

      const body = JSON.stringify(data);

      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/${endPoint}`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => res.json());
    }

    return authorizationResponse;
  }
}
