import { sanitizeUser, users, usersData, UsersSchema } from 'mocks/models/user';
import { digestText } from 'mocks/utils/hash';
import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { save } from 'mocks/utils/data';

// `object`タイプの`usersData`と配列タイプの`users`を保存
export const store = (request: SignUpRequest): SignUpResponse => {
  const session_id = digestText(request.email);
  const uuid = digestText(session_id);

  const newUserData: UsersSchema = {
    id: users.length + 1,
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: digestText(request.password),
  };

  usersData[uuid] = newUserData;
  users.push(sanitizeUser(newUserData));
  save('usersData', usersData);

  return { user: sanitizeUser(newUserData) };
};
