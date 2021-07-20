import faker from 'faker';

import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { db, UserDocument } from 'mocks/models';
import { uuid } from 'mocks/utils/uuid';
import { digestText } from 'mocks/utils/crypto';

export const guestUser: UserDocument = {
  id: uuid(),
  name: 'ゲストユーザー',
  email: GUEST_EMAIL,
  emailVerifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  password: digestText(GUEST_PASSWORD),
};

export const otherUser: UserDocument = {
  id: uuid(),
  name: 'other_ユーザー',
  email: 'other_' + GUEST_EMAIL,
  emailVerifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  password: digestText(GUEST_PASSWORD),
};

export const unverifiedUser: UserDocument = {
  id: uuid(),
  name: '未認証ユーザー',
  email: 'unverified_' + GUEST_EMAIL,
  emailVerifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  password: digestText(GUEST_PASSWORD),
};

const initialUsers: UserDocument[] = [guestUser, otherUser, unverifiedUser];

const runSeeder = (props: { count: number }) => {
  initialUsers.forEach((user) => {
    db.create('users', user);
  });

  [...Array(props.count)].forEach(() => {
    db.create('users', {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      emailVerifiedAt: faker.date.recent(),
      password: digestText(GUEST_PASSWORD),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  });
};

export const refresh = () => {
  db.reset('users');
  runSeeder({ count: 1 });
};

const initialize = () => {
  try {
    db.load('users');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (db.exists('users')) return;
  else runSeeder({ count: 1 });
};

// 初期化実行
initialize();
