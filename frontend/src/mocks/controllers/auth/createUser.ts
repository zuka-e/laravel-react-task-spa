import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { collection } from 'mocks/models';
import { sanitizeUser, UserDocument } from 'mocks/models/user';
import { auth } from 'mocks/utils';
import { save } from 'mocks/utils/models';
import { digestText } from 'mocks/utils/crypto';

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
  auth.login(newUserDoc);
  save('users', collection.users);

  return { user: sanitizeUser(newUserDoc) };
};
