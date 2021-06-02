import { UpdateProfileRequest, UpdateProfileResponse } from 'store/thunks';
import { db, UserDocument } from 'mocks/models';

type UpdateProfileProps = {
  currentUser: UserDocument;
  request: UpdateProfileRequest;
};

export const update = (props: UpdateProfileProps) => {
  const { currentUser, request } = props;
  const newUserDoc = {
    ...currentUser,
    name: request.name || currentUser.name,
    email: request.email || currentUser.email,
  };

  const uuid = String(currentUser.id);

  db.collection('users')[uuid] = newUserDoc;
  db.save('users', db.collection('users'));

  const response: UpdateProfileResponse = {
    name: newUserDoc.name,
    email: newUserDoc.email,
  };

  return response;
};
