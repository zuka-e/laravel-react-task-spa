import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { User } from 'models/User';
import { collection, UserDocument } from 'mocks/models';
import { digestText } from 'mocks/utils/crypto';
import { exists, load, save } from 'mocks/utils/data';

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
    load(collection.users, 'users');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (exists(collection.users)) return;

  initialUsers.forEach((user) => {
    const password = digestText(GUEST_PASSWORD);
    const userDoc: UserDocument = { ...user, password };
    const uuid = String(user.id);

    collection.users[uuid] = userDoc;
    save('users', userDoc);
  });
};

// 初期化実行
initialize();
