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
    const authenticationResponse = await this.makeAuthRequest(customerSignIn, 'login');
    if ('customer' in authenticationResponse) {
      const authorizationResponse = await this.authorizationService.getPasswordFlowToken(
        customerSignIn.email,
        customerSignIn.password,
      );

      if ('access_token' in authorizationResponse) {
        // NOTE: according to SCRUM-42 we passing auth token to signInResult interface object
        localStorage.setItem('userToken', authorizationResponse.access_token);
        authenticationResponse.accessToken = authorizationResponse.access_token;
      }
    }

    return authenticationResponse;
  }

  private async makeAuthRequest(
    data: CustomerSignIn | CustomerDraft,
    endPoint: 'login' | 'signup',
  ): Promise<SignInResult | ErrorResponse> {
    const authenticationResponse = await this.authorizationService.getAnonymousSessionToken();

    if ('access_token' in authenticationResponse) {
      const headers = new Headers({
        Authorization: `Bearer ${authenticationResponse.access_token}`,
        'Content-type': 'application/json',
      });

      const body = JSON.stringify(data);

      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/${endPoint}`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => res.json());
    }

    return authenticationResponse;
  }
}
