// NOTE: We use anonymous session token to authenticate(sign in/ sign up) user
import CustomerDraft from '../models/customer-draft.model';
import CustomerSignIn from '../models/customer-sign-in.model';
import ErrorResponse from '../models/error-response.model';
import LocalStorageEndpoint from '../models/local-storage-endpoint.model';
import SignInResult from '../models/sign-in-result.model';
import authorizationService from './authorization.service';

class AuthenticationService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientAPIUrl = process.env.CTP_API_URL;

  private isLoggedIn = false;

  private tokenExpirationTimeoutId: NodeJS.Timeout | null = null;

  private refreshToken: string | null;

  private authorizationService = authorizationService;

  private loginCallbacks: Array<() => void> = [];

  private logoutCallbacks: Array<() => void> = [];

  constructor() {
    this.refreshToken = localStorage.getItem(LocalStorageEndpoint.refreshToken);

    if (localStorage.getItem(LocalStorageEndpoint.userToken)) {
      this.isLoggedIn = true;
    }
  }

  async signUpCustomer(customerDraft: CustomerDraft): Promise<SignInResult | ErrorResponse> {
    return this.makeAuthRequest(customerDraft, 'signup');
  }

  async signInCustomer(customerSignIn: CustomerSignIn): Promise<SignInResult | ErrorResponse> {
    return this.makeAuthRequest(customerSignIn, 'login');
  }

  public signOutCustomer() {
    if (this.isLoggedIn) {
      this.isLoggedIn = false;
      localStorage.removeItem(LocalStorageEndpoint.userToken);
      localStorage.removeItem(LocalStorageEndpoint.refreshToken);
      if (this.tokenExpirationTimeoutId) {
        clearTimeout(this.tokenExpirationTimeoutId);
      }
      this.logoutCallbacks.forEach((logoutCallback) => logoutCallback());
    } else {
      throw new Error('There is no logged in customer');
    }
  }

  private async makeAuthRequest(
    data: CustomerSignIn | CustomerDraft,
    endPoint: 'login' | 'signup',
  ): Promise<SignInResult | ErrorResponse> {
    let authorizationResponse;
    const isLogin = endPoint === 'login';

    if (isLogin) {
      authorizationResponse = await this.authorizationService.getPasswordFlowToken(
        data.email,
        data.password,
      );
    } else {
      authorizationResponse = await this.authorizationService.getAnonymousSessionToken();
    }

    if ('access_token' in authorizationResponse) {
      const headers = new Headers({
        Authorization: `Bearer ${authorizationResponse.access_token}`,
        'Content-type': 'application/json',
      });

      if (isLogin) {
        this.isLoggedIn = true;
        localStorage.setItem(LocalStorageEndpoint.userToken, authorizationResponse.access_token);
        localStorage.setItem(
          LocalStorageEndpoint.refreshToken,
          authorizationResponse.refresh_token,
        );
        // NOTE: Get new access token 2 minutes before expiration
        this.setTokenExpirationTimeotId((authorizationResponse.expires_in - 120) * 100);
      }

      const body = JSON.stringify(data);
      return fetch(`${this.clientAPIUrl}/${this.projectKey}/me/${endPoint}`, {
        method: 'POST',
        headers,
        body,
      }).then((res) => {
        if (isLogin) {
          this.loginCallbacks.forEach((loginCallback) => loginCallback());
        }
        return res.json();
      });
    }
    return authorizationResponse;
  }

  private setTokenExpirationTimeotId(timeout: number) {
    this.tokenExpirationTimeoutId = setTimeout(
      this.handleAccessTokenExpiration.bind(this),
      timeout,
    );
  }

  private async handleAccessTokenExpiration() {
    if (this.refreshToken) {
      const response = await this.authorizationService.getRefreshTokenFlowToken(this.refreshToken);
      if ('access_token' in response) {
        localStorage.setItem(LocalStorageEndpoint.userToken, response.access_token);
        this.setTokenExpirationTimeotId((response.expires_in - 120) * 100);
      }
    } else {
      throw new Error('There is no refreshToken item in localStorage');
    }
  }

  public onLogin(loginCallback: () => void): void {
    this.loginCallbacks.push(loginCallback);
  }

  public onLogout(logoutCallback: () => void): void {
    this.logoutCallbacks.push(logoutCallback);
  }
}

const authenticationService = new AuthenticationService();

export default authenticationService;
