import ErrorResponse from '../models/error-response.model';
import TokenResponse from '../models/tokenResponse.model';

export default class AuthorizationService {
  private projectKey = process.env.CTP_PROJECT_KEY;

  private clientID = process.env.CTP_CLIENT_ID;

  private clientSecret = process.env.CTP_CLIENT_SECRET;

  private clientScopes = process.env.CTP_SCOPES;

  private clientAuthUrl = process.env.CTP_AUTH_URL;

  async getPasswordFlowToken(
    email: string,
    password: string,
  ): Promise<TokenResponse | ErrorResponse> {
    const headers = new Headers({
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
      'Content-type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.append('grant_type', 'password');
    body.append('username', email);
    body.append('password', password);
    if (this.clientScopes) {
      body.append('scope', this.clientScopes);
    }

    return fetch(`${this.clientAuthUrl}/oauth/${this.projectKey}/customers/token`, {
      method: 'POST',
      headers,
      body,
    }).then((res) => res.json());
  }

  async getClientCredentialsFlowToken(): Promise<TokenResponse | ErrorResponse> {
    const headers = new Headers({
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
    });

    const body = new URLSearchParams();

    body.append('grant_type', 'client_credentials');
    if (this.clientScopes) {
      body.append('scope', this.clientScopes);
    }

    return fetch(`${this.clientAuthUrl}/oauth/token`, {
      method: 'POST',
      headers,
      body,
    }).then((res) => res.json());
  }

  async getAnonymousSessionToken(): Promise<TokenResponse | ErrorResponse> {
    const headers = new Headers({
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
      'Content-type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.append('grant_type', 'client_credentials');
    if (this.clientScopes) {
      body.append('scope', this.clientScopes);
    }

    return fetch(`${this.clientAuthUrl}/oauth/${this.projectKey}/anonymous/token`, {
      method: 'POST',
      headers,
      body,
    }).then((res) => res.json());
  }

  async getRefreshTokenFlowToken(refreshToken: string): Promise<TokenResponse> {
    const headers = new Headers({
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();

    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', refreshToken);
    if (this.clientScopes) {
      body.append('scope', this.clientScopes);
    }

    return fetch(`${this.clientAuthUrl}/oauth/token`, {
      method: 'POST',
      headers,
      body,
    }).then((res) => res.json());
  }
}
