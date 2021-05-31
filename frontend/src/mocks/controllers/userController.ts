import { sanitizeUser, UsersSchema } from 'mocks/models/user';
import { usersData } from 'mocks/data/users';
import { digestText } from 'mocks/utils/crypto';
import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { save } from 'mocks/utils/data';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserData: UsersSchema = {
    id: Object.values(usersData).length + 1,
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: digestText(request.password),
  };
  const uuid = String(newUserData.id);

  usersData[uuid] = newUserData;

  save('usersData', usersData);

  return { user: sanitizeUser(newUserData) };
};
