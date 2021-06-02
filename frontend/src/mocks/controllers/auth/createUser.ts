import { SignUpRequest, SignUpResponse } from 'store/thunks';
import { db, auth } from 'mocks/models';
import { sanitizeUser, UserDocument } from 'mocks/models/user';
import { digestText } from 'mocks/utils/crypto';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserDoc: UserDocument = {
    id: Object.values(db.collection('users')).length + 1,
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: digestText(request.password),
  };
  const uuid = String(newUserDoc.id);

  db.collection('users')[uuid] = newUserDoc;
  auth.login(newUserDoc);
  db.save('users', db.collection('users'));

  return { user: sanitizeUser(newUserDoc) };
};
