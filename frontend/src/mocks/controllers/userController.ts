import { sanitizeUser, UserDocument } from 'mocks/models/user';
import { collection } from 'mocks/models';
import { digestText } from 'mocks/utils/crypto';
import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { save } from 'mocks/utils/data';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserDoc: UserDocument = {
    id: Object.values(collection.users).length + 1,
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: digestText(request.password),
  };
  const uuid = String(newUserDoc.id);

  collection.users[uuid] = newUserDoc;

  save('users', collection.users);

  return { user: sanitizeUser(newUserDoc) };
};
