import LocalStorageEndpoint from '../models/local-storage-endpoint.model';
import authorizationService from '../services/authorization.service';

const getCurrentAccessToken = async () => {
  let token = localStorage.getItem(LocalStorageEndpoint.userToken);

  if (!token) {
    const authorizationResponse = await authorizationService.getAnonymousSessionToken();
    if ('access_token' in authorizationResponse) {
      token = authorizationResponse.access_token;
      localStorage.setItem(LocalStorageEndpoint.userToken, token);
    }
  }

  return token;
};

export default getCurrentAccessToken;
