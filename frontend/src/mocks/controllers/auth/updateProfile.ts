import { UpdateProfileRequest, UpdateProfileResponse } from 'store/thunks';
import { UserDocument } from 'mocks/models/user';
import { collection } from 'mocks/models';
import { save } from 'mocks/utils/data';

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

  collection.users[uuid] = newUserDoc;
  save('users', collection.users);

  const response: UpdateProfileResponse = {
    name: newUserDoc.name,
    email: newUserDoc.email,
  };

  return response;
};
