import { UpdatePasswordRequest } from 'store/thunks/auth';
import { db, UserDocument } from 'mocks/models';
import { digestText } from 'mocks/utils/crypto';

type UpdatePasswordProps = {
  currentUser: UserDocument;
  request: UpdatePasswordRequest;
};

export const update = (props: UpdatePasswordProps) => {
  const { currentUser, request } = props;

  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  const newUserDoc: UserDocument = {
    ...currentUser,
    updatedAt: new Date(),
    password: digestText(request.password),
  };

  db.update('users', newUserDoc);
};
