import { SignInRequest } from 'store/thunks/signInWithEmail';
import { User } from 'models/User';
import { digestText } from 'mocks/utils/hash';
import { load, save } from 'mocks/utils/data';

export type UsersSchema = User & { password: string };

export type UsersDataType = { [uuid: string]: UsersSchema };

// `uuid`で検索できるデータタイプ
export const usersData: UsersDataType = {};

// `password`データを除外
export const sanitizeUser = ({ password, ...rest }: UsersSchema) => rest;

export const users: User[] = Object.values(usersData).map((user) =>
  sanitizeUser(user)
);

// `object`タイプの`usersData`と配列タイプの`users`を更新
export const addUser = (userData: UsersSchema) => {
  const session_id = digestText(userData.email);
  const uuid = digestText(session_id);

  usersData[uuid] = userData;
  users.push(sanitizeUser(userData));
};

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

// `localStorage` 読み書き
export const saveUser = () => save('usersData', usersData);
export const loadUser = () => load(usersData, 'usersData');
