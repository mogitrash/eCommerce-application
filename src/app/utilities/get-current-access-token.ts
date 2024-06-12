import LocalStorageEndpoint from '../models/local-storage-endpoint.model';
import authorizationService from '../services/authorization.service';

const getCurrentAccessToken = async () => {
  const userToken = localStorage.getItem(LocalStorageEndpoint.userToken);
  const anonymousToken = localStorage.getItem(LocalStorageEndpoint.anonymousToken);

  const resultToken = userToken || anonymousToken;

  if (resultToken) {
    return resultToken;
  }

  const authorizationResponse = await authorizationService.getAnonymousSessionToken();
  if ('access_token' in authorizationResponse) {
    localStorage.setItem(LocalStorageEndpoint.anonymousToken, authorizationResponse.access_token);
    return authorizationResponse.access_token;
  }

  return authorizationResponse;
};

export default getCurrentAccessToken;
