import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { User } from 'models/User';
import { sanitizeUser, users, usersData, UsersSchema } from 'mocks/models/user';
import { digestText } from 'mocks/utils/hash';
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
    load(usersData, 'usersData');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (exists(usersData)) return;

  initialUsers.forEach((user) => {
    const password = digestText(GUEST_PASSWORD);
    const userData: UsersSchema = { ...user, password };
    const session_id = digestText(userData.email);
    const uuid = digestText(session_id);

    usersData[uuid] = userData;
    users.push(sanitizeUser(userData));

    save('usersData', userData);
  });
};

// 初期化実行
initialize();
