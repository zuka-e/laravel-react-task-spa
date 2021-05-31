import { User } from 'models/User';
import { SignInRequest } from 'store/thunks/signInWithEmail';
import { digestText } from 'mocks/utils/crypto';

export type UsersSchema = User & { password: string };

export type UsersDataType = { [uuid: string]: UsersSchema };

// `uuid`で検索できるデータタイプ
export const usersData: UsersDataType = {};

export const users: User[] = Object.values(usersData).map((user) =>
  sanitizeUser(user)
);

// `password`データを除外
export const sanitizeUser = ({ password, ...rest }: UsersSchema) => rest;

export const isUniqueEmail = (email: string) =>
  users.filter((user) => user.email === email).length === 0;

export const authenticate = (request: SignInRequest) => {
  const user = Object.values(usersData).filter(
    (user) => user.email === request.email
  )[0];

  const digestRequestPassword = digestText(request.password);
  const digestPassword = user?.password;

  return digestRequestPassword === digestPassword ? user : false;
};
