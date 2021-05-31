import { UsersCollection } from './user';

export const collection = {
  users: {} as UsersCollection,
} as const;

export * from './user';
