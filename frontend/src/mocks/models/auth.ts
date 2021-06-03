import { UserDocument } from 'mocks/models';

/**
 * セッション切断まで保持される認証ユーザー
 */
const user = {} as UserDocument;

const exists = () => Object.keys(user).length > 0;

export const getUser = () => {
  const userRef = { ...user };
  return exists() ? userRef : null;
};

export const setUser = (userDoc: UserDocument) => Object.assign(user, userDoc);

export const login = (userDoc: UserDocument) => setUser(userDoc);

export const logout = () =>
  Object.keys(user).forEach((key) => delete user[key as keyof typeof user]);
