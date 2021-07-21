import { User } from 'models/User';
import { CollectionBase, DocumentBase } from '.';

export interface UserDocument extends DocumentBase {
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  password: string;
}

export interface UsersCollection extends CollectionBase {
  [uuid: string]: UserDocument;
}

export const sanitizeUser = (userDoc: UserDocument): User => {
  const { password, ...rest } = userDoc;
  return rest;
};
