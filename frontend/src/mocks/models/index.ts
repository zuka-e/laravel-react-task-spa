import { UsersCollection } from './user';

export const collection = {
  users: {} as UsersCollection,
} as const;

export * as auth from './auth';
export * from './user';
