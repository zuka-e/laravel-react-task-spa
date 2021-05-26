import { SignInRequest } from 'store/thunks/signInWithEmail';
import { User } from '../../models/User';
import { GUEST_EMAIL, GUEST_PASSWORD } from '../utils/const';
import { digestText } from '../utils/hash';
import { load, save } from '../utils/storage';

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

export const authenticate = (request: SignInRequest) => {
  const { email, password } = request;
  const session_id = digestText(email);
  const uuid = digestText(session_id);
  const digestRequestPassword = digestText(password);
  const user = usersData[uuid];
  const digestPassword = user?.password;

  if (digestRequestPassword === digestPassword) {
    return { ...user, session_id };
  }
  throw Error('422: パスワードかメールアドレスが間違っています');
};

// `localStorage` 読み書き
export const saveUser = () => save('usersData', usersData);
export const loadUser = () => load(usersData, 'usersData');

export const initialize = () => {
  loadUser();
  if (Object.keys(usersData).length > 0) return;

  const guestUser: UsersSchema = {
    id: 1,
    name: 'ゲストユーザー',
    email: GUEST_EMAIL,
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    password: digestText(GUEST_PASSWORD),
  };

  addUser(guestUser);
  saveUser();
};

// 初期化実行
try {
  initialize();
} catch (error) {
  console.log(error); // ignore json parse error
}
