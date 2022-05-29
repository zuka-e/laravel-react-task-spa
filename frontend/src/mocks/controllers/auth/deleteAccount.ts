import { auth, db, UserDocument } from 'mocks/models';

export const remove = (currentUser: UserDocument) => {
  if (!db.remove('users', currentUser.id))
    throw new Error('The Account failed to be deleted');

  auth.logout();
};
