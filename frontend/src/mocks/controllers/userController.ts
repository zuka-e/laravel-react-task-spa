import { sanitizeUser, users, usersData, UsersSchema } from 'mocks/models/user';
import { digestText } from 'mocks/utils/hash';
import { save } from 'mocks/utils/data';

// `object`タイプの`usersData`と配列タイプの`users`を保存
export const store = (userData: UsersSchema) => {
  const session_id = digestText(userData.email);
  const uuid = digestText(session_id);

  usersData[uuid] = userData;
  users.push(sanitizeUser(userData));

  save('usersData', usersData);
};
