import { ResetPasswordRequest } from 'store/thunks';
import { auth, db, UserDocument } from 'mocks/models';
import { digestText } from 'mocks/utils/crypto';

export const reset = (request: ResetPasswordRequest) => {
  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  const requestedUser = db.where('users', 'email', request.email)[0];
  const newUserDoc: UserDocument = {
    ...requestedUser,
    updatedAt: new Date(),
    password: digestText(request.password),
  };

  db.update('users', newUserDoc);
  auth.login(newUserDoc);
};
