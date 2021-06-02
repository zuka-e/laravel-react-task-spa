import { SignInRequest } from 'store/thunks';
import { db, auth, sanitizeUser } from 'mocks/models';
import { digestText } from './crypto';

export const CSRF_TOKEN = 'csrf-token'; // session
export const XSRF_TOKEN = 'XSRF-TOKEN'; // cookie
export const X_XSRF_TOKEN = 'X-XSRF-TOKEN'; // header

export const hasValidToken = (requestToken: string) => {
  const sessionToken = sessionStorage.getItem(CSRF_TOKEN);
  return requestToken === sessionToken;
};

export const isUniqueEmail = (email: string) => {
  const matchedUsers = Object.values(db.collection('users')).filter(
    (user) => user.email === email
  );
  // 合致するデータがない場合`matchedUsers[0]`は`undefied`
  const matchedEmail = matchedUsers[0]?.email;
  const ownEmail = auth.getUser()?.email;
  // 一致する`email`がないか、もしあっても自身のものであれば`true`(unique)
  return !matchedEmail || matchedEmail === ownEmail;
};

export const authenticate = (request: SignInRequest) => {
  const matchedUserDocs = Object.values(db.collection('users')).filter(
    (user) => user.email === request.email
  );
  const userDocWithTheRequestedEmail = matchedUserDocs[0];

  if (!userDocWithTheRequestedEmail) return null;

  const digestRequestPassword = digestText(request.password);
  const digestPassword = userDocWithTheRequestedEmail.password;

  if (digestRequestPassword === digestPassword) {
    auth.login(userDocWithTheRequestedEmail);
    return sanitizeUser(userDocWithTheRequestedEmail);
  } else {
    return null;
  }
};
