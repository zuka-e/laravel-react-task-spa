import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { db, auth } from 'mocks/models';
import { sanitizeUser, UserDocument } from 'mocks/models/user';
import { digestText } from 'mocks/utils/crypto';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserDoc = {
    name: request.email,
    email: request.email,
    password: digestText(request.password),
  } as UserDocument;

  db.create('users', newUserDoc);
  auth.login(newUserDoc);

  return { user: sanitizeUser(newUserDoc) };
};
