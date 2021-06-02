import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { User } from 'models/User';
import { db, UserDocument } from 'mocks/models';
import { digestText } from 'mocks/utils/crypto';

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
  name: '未認証ユーザー',
  email: GUEST_EMAIL + '_any_string',
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialUsers: User[] = [guestUser, unverifiedUser];

export const reset = () => {
  db.reset();
  initialUsers.forEach((user) => {
    const password = digestText(GUEST_PASSWORD);
    const userDoc: UserDocument = { ...user, password };
    db.create('users', userDoc);
  });
};

const initialize = () => {
  try {
    db.load('users');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (db.exists('users')) return;
  else reset();
};

// 初期化実行
initialize();
