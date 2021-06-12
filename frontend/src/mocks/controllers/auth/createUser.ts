import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { db, auth } from 'mocks/models';
import { sanitizeUser, UserDocument } from 'mocks/models/user';
import { digestText } from 'mocks/utils/crypto';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserDoc = {
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    password: digestText(request.password),
  } as UserDocument;

  const createdUser = db.create('users', newUserDoc);
  auth.login(createdUser);

  return { user: sanitizeUser(createdUser) };
};
