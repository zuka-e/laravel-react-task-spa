import { SignInRequest } from 'store/thunks';
import { collection } from 'mocks/models';
import { digestText } from './crypto';

export const CSRF_TOKEN = 'csrf-token'; // session
export const XSRF_TOKEN = 'XSRF-TOKEN'; // cookie
export const X_XSRF_TOKEN = 'X-XSRF-TOKEN'; // header

export const hasValidToken = (requestToken: string) => {
  const sessionToken = sessionStorage.getItem(CSRF_TOKEN);
  return requestToken === sessionToken;
};

export const isUniqueEmail = (email: string) => {
  const matchedUserDocs = Object.values(collection.users).filter(
    (user) => user.email === email
  );
  return matchedUserDocs.length === 0;
};

export const authenticate = (request: SignInRequest) => {
  const user = Object.values(collection.users).filter(
    (user) => user.email === request.email
  )[0];

  const digestRequestPassword = digestText(request.password);
  const digestPassword = user?.password;

  return digestRequestPassword === digestPassword ? user : false;
};
