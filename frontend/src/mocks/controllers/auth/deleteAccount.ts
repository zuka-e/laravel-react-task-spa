import { db, UserDocument } from 'mocks/models';

export const remove = (currentUser: UserDocument) => {
  const docId = String(currentUser.id);

  if (!db.remove('users', docId))
    throw new Error('The Account failed to be deleted');
};
