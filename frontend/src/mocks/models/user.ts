import { User } from 'models/User';

export type UsersSchema = User & { password: string };

export type UsersDataType = { [uuid: string]: UsersSchema };

export const sanitizeUser = (userData: UsersSchema): User => {
  const { password, ...rest } = userData;
  return rest;
};
