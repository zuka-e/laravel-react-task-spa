import { SignInRequest } from 'store/thunks';
import { generateRandomString } from 'utils/generator';
import { db, auth, sanitizeUser } from 'mocks/models';
import { encrypt, decrypt, digestText } from './crypto';

export const CSRF_TOKEN = 'csrf-token'; // session
export const XSRF_TOKEN = 'XSRF-TOKEN'; // cookie
export const X_XSRF_TOKEN = 'X-XSRF-TOKEN'; // header

export const createSessionId = () => {
  const sessionId = generateRandomString(32);
  const encryptedSessionId = encrypt(sessionId);
  const userId = auth.getUser()?.id;

  sessionStorage.setItem(sessionId, String(userId));
  return encryptedSessionId;
};

export const regenerateSessionId = (currentSessionId: string) => {
  sessionStorage.removeItem(currentSessionId);
  return createSessionId();
};

/**
 * 1. `encryptedSessionId`の有無を確認
 * 2. セッションIDを復号化し、セッション(sessionStorage)からユーザーIDを取得
 * 3. ユーザーIDからユーザーを取得
 */
export const getUserFromSession = (encryptedSessionId: string) => {
  // `req.cookies`は`string`型を返すが取得できない場合は`undefied`になる
  if (!encryptedSessionId) {
    console.log('There is no session_id in cookies');
    return null;
  }

  const sessionId = decrypt(encryptedSessionId);
  const userId = sessionStorage.getItem(sessionId);

  if (!userId) {
    console.log('There is no session');
    return null;
  }

  // 存在しない`userId`を指定した場合、`undefined`
  const user = db.collection('users')[userId];

  return user || null;
};

export const hasValidToken = (requestToken: string) => {
  const sessionToken = sessionStorage.getItem(CSRF_TOKEN);
  return requestToken === sessionToken;
};

/**
 * リクエストされた`password`をハッシュ化し、`User`のものと比較
 */
export const isValidPassword = (
  requestPassword: string,
  userPassword: string
) => {
  const digestedRequestPassword = digestText(requestPassword);
  const digestedUserPassword = userPassword;

  return digestedRequestPassword === digestedUserPassword;
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

/**
 * 1. `request`の`email`から`user`を取得
 * 2. `request`の`password`と取得した`user`の`password`を比較
 * @param request - {`email`, `password`,`remember?`}
 */
export const authenticate = (request: SignInRequest) => {
  const matchedUsers = Object.values(db.collection('users')).filter(
    (user) => user.email === request.email
  );
  const requestedUser = matchedUsers[0];

  if (!requestedUser) return null;

  if (isValidPassword(request.password, requestedUser.password)) {
    auth.login(requestedUser);
    return sanitizeUser(requestedUser);
  } else {
    return null;
  }
};
