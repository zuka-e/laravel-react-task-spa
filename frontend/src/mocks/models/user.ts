import { User } from 'models/User';

export type UserDocument = User & { password: string };

export type UsersCollection = { [uuid: string]: UserDocument };

export const sanitizeUser = (userDoc: UserDocument): User => {
  const { password, ...rest } = userDoc;
  return rest;
};
