import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { User } from 'models/User';
import {
  addUser,
  loadUser,
  saveUser,
  usersData,
  UsersSchema,
} from 'mocks/models/user';
import { digestText } from 'mocks/utils/hash';
import { exists } from 'mocks/utils/data';

export const guestUser: User = {
  id: 1,
  name: 'ゲストユーザー',
  email: GUEST_EMAIL,
  emailVerifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const unverifiedUser: User = {
  id: 2,
  name: 'ゲストユーザー',
  email: GUEST_EMAIL + 'any_string',
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialUsers: User[] = [guestUser, unverifiedUser];

const initialize = () => {
  try {
    loadUser();
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (exists(usersData)) return;

  initialUsers.forEach((user) => {
    const password = digestText(GUEST_PASSWORD);
    const userData: UsersSchema = { ...user, password };
    addUser(userData);
  });
  saveUser();
};

// 初期化実行
initialize();
