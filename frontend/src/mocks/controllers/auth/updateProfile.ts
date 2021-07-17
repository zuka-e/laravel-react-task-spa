import { UpdateProfileRequest, UpdateProfileResponse } from 'store/thunks/auth';
import { db, UserDocument } from 'mocks/models';

type UpdateProfileProps = {
  currentUser: UserDocument;
  request: UpdateProfileRequest;
};

export const update = (props: UpdateProfileProps) => {
  const { currentUser, request } = props;
  const IsEmailUpdated = currentUser.email !== request.email;
  const newUserDoc: UserDocument = {
    ...currentUser,
    name: request.name || currentUser.name,
    email: request.email || currentUser.email,
    emailVerifiedAt: IsEmailUpdated ? null : currentUser.emailVerifiedAt,
    updatedAt: new Date(),
  };

  db.update('users', newUserDoc);

  const response: UpdateProfileResponse = {
    name: newUserDoc.name,
    email: newUserDoc.email,
  };

  return response;
};
