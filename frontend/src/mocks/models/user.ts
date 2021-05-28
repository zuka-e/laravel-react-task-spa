import { User } from 'models/User';
import { SignInRequest } from 'store/thunks/signInWithEmail';
import { digestText } from 'mocks/utils/hash';

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
  const { email, password } = request;
  const session_id = digestText(email);
  const uuid = digestText(session_id);
  const digestRequestPassword = digestText(password);
  const user = usersData[uuid];
  const digestPassword = user?.password;

  if (digestRequestPassword === digestPassword) {
    return { ...user, session_id };
  } else return false;
};
