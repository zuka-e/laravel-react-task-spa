import { UsersCollection } from './user';

const database = {
  users: {} as UsersCollection,
};

type DB = typeof database;

const collection = <K extends keyof DB>(key: K) => database[key];

const save = <K extends keyof DB, T extends DB[K]>(key: K, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const load = <T extends DB[K], K extends keyof DB>(data: T, key: K) => {
  const storedData = localStorage.getItem(key) || '{}';
  Object.assign(data, JSON.parse(storedData));
};

const exists = (data: object) => Object.keys(data).length > 0;

export const db = {
  collection,
  save,
  load,
  exists,
};

export * as auth from './auth';
export * from './user';
