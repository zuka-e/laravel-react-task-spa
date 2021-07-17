import { User } from 'models/User';
import { CollectionBase, DocumentBase } from '.';

export interface UserDocument extends DocumentBase {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

export interface UsersCollection extends CollectionBase {
  [uuid: string]: UserDocument;
}

export const sanitizeUser = (userDoc: UserDocument): User => {
  const { password, ...rest } = userDoc;
  return rest;
};
