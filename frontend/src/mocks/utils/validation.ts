import { ResetPasswordRequest, SignInRequest } from 'store/thunks/auth';
import { generateRandomString } from 'utils/generator';
import { db, auth } from 'mocks/models';
import { encrypt, decrypt, digestText } from './crypto';
import { GUEST_EMAIL } from 'config/app';

export const CSRF_TOKEN = 'csrf-token'; // session
export const XSRF_TOKEN = 'XSRF-TOKEN'; // cookie
export const X_XSRF_TOKEN = 'X-XSRF-TOKEN'; // header

/**
 * 1. 適当な長さのランダム文字列を生成し、セッションIDとする
 * 2. セッションIDを`key`、`userId`を`value`として`localStorage`に格納
 *
 * @param  userId - リクエストユーザーのID
 * @returns 暗号化済みセッションID (`cookie`格納用)
 */
export const createSessionId = (userId: string | null) => {
  const sessionId = generateRandomString(32);
  const encryptedSessionId = encrypt(sessionId);

  localStorage.setItem(sessionId, String(userId));
  return encryptedSessionId;
};

/**
 * 1. 現在のセッションIDを削除
 * 2. 認証ユーザーのIDを取得
 * 3. ユーザーIDを使用して新規にセッションIDを生成
 *
 * @param currentSessionId 復号化済み`session_id`
 * @returns 新規の暗号化済みセッションID (`cookie`格納用)
 */
export const regenerateSessionId = (currentSessionId: string) => {
  localStorage.removeItem(currentSessionId);
  const userId = auth.getUser()?.id || null;

  return createSessionId(userId);
};

/**
 * 1. `encryptedSessionId`の有無を確認
 * 2. セッションIDを復号化し、セッション(localStorage)からユーザーIDを取得
 * 3. ユーザーIDからユーザーを取得
 *
 * @param encryptedSessionId `cookie`に格納された`session_id`
 * @returns `User` (手順から取得できた場合) | `null`
 */
export const getUserFromSession = (encryptedSessionId: string) => {
  // `req.cookies`は`string`型を返すが取得できない場合、`undefined`
  if (!encryptedSessionId) {
    console.log('There is no session_id in cookies');
    return null;
  }

  const sessionId = decrypt(encryptedSessionId);
  const userId = localStorage.getItem(sessionId);

  if (!userId) {
    console.log('There is no session');
    return null;
  }
  // 存在しない`userId`を指定した場合、`undefined`
  const user = db.collection('users')[userId];

  return user || null;
};

/**
 * 1. 適当な長さのランダム文字列のハッシュ値をCSRFトークンとして発行
 * 2. セッション (localStorage) の`csrf-token`にトークンを格納
 */
export const generateCsrfToken = () => {
  const randomString = generateRandomString(32);
  const csrfToken = digestText(randomString);

  localStorage.setItem(CSRF_TOKEN, csrfToken);
  return csrfToken;
};

/**
 * HTTPヘッダーの`X_XSRF_TOKEN`とセッションの`csrf-token`を比較
 */
export const hasValidToken = (requestToken: string) => {
  const sessionToken = localStorage.getItem(CSRF_TOKEN);
  return requestToken === sessionToken;
};

/**
 * リクエストされた`password`をハッシュ化し、`User`の`password`と比較
 */
export const isValidPassword = (
  requestPassword: string,
  userPassword: string
) => {
  const digestedRequestPassword = digestText(requestPassword);
  const digestedUserPassword = userPassword;

  return digestedRequestPassword === digestedUserPassword;
};

/**
 * 1. 引数の`email`から`User`を検索
 * 2. 引数の`email`と取得した`User`の`email`を比較
 *
 * @returns `email`が一致しない又は自身の`email`の場合 `true`
 */
export const isUniqueEmail = (email: string) => {
  const matchedUsers = Object.values(db.collection('users')).filter(
    (user) => user.email === email
  );
  // 合致するデータがない場合`matchedUsers[0]`は`undefined`
  const matchedEmail = matchedUsers[0]?.email;
  const ownEmail = auth.getUser()?.email;

  return !matchedEmail || matchedEmail === ownEmail;
};

/**
 * 1. `request`の`email`から`user`を取得
 * 2. `request`の`password`と取得した`user`の`password`を比較
 * 3. 成功時は認証ユーザーとして取得した`user`をセット
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
    return requestedUser;
  } else {
    return null;
  }
};

/**
 * パスワードリセット用のトークンを生成 (パスワードリセットリンクのパラメータにする)
 */
export const validPasswordResetTokenOf = {
  [GUEST_EMAIL]: generateRandomString(32),
};

/**
 * リクエストの`email`と`token`のセットが一致するか検証
 */
export const isValidPasswordResetToken = (request: ResetPasswordRequest) =>
  validPasswordResetTokenOf[request.email] === request.token;
