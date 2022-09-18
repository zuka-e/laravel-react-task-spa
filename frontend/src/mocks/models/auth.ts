import { UserDocument } from 'mocks/models';

/**
 * セッション切断まで保持される認証ユーザー
 */
const user = {} as UserDocument;

const exists = () => Object.keys(user).length > 0;

/**
 * 認証ユーザー取得
 */
export const getUser = () => {
  const userRef = { ...user };
  return exists() ? userRef : null;
};

/**
 * 認証ユーザーとして登録
 */
export const setUser = (userDoc: UserDocument) => Object.assign(user, userDoc);

/**
 * 認証ユーザーとして登録
 */
export const login = (userDoc: UserDocument) => setUser(userDoc);

/**
 * 登録した認証ユーザーを削除し、セッション(localStorage)を破棄
 */
export const logout = () => {
  Object.keys(user).forEach((key) => delete user[key as keyof typeof user]);
  localStorage.clear();
};
