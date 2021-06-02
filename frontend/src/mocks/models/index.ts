import { UserDocument, UsersCollection } from './user';

const initilalState = {
  count: {
    users: 0,
  },
  database: {
    users: {} as UsersCollection,
  } as const,
};

// `initilalState`が変更されないようにスプレッド演算子でコピー
const count = { ...initilalState.count };
const database = { ...initilalState.database };

type DB = typeof database;

const load = <K extends keyof DB>(key: K) => {
  const storedData = localStorage.getItem(key) || '{}';
  Object.assign(database[key], JSON.parse(storedData));
};

const save = <K extends keyof DB>(key: K) => {
  localStorage.setItem(key, JSON.stringify(database[key]));
};

const exists = <K extends keyof DB>(key: K) =>
  Object.keys(database[key]).length > 0;

const collection = <K extends keyof DB>(key: K) => {
  const collectionClone = { ...database[key] };
  return collectionClone; // 参照のみ許可 (直接データを返さない)
};

const create = <K extends keyof DB, T extends DB[K]>(key: K, doc: T['id']) => {
  const defaultValues = {
    id: count[key] + 1,
    emailVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserDocument;
  // `guestUser`など、プロパティ設定がある場合はデフォルト値を上書きする
  const newDoc: UserDocument = { ...defaultValues, ...doc };
  const newState = { ...database[key], [String(newDoc.id)]: newDoc };

  database[key] = newState;
  count[key] += 1;
  save(key);
};

const update = <K extends keyof DB, T extends DB[K]>(key: K, doc: T['id']) => {
  const uuid = String(doc.id);
  const newState = { ...database[key], [uuid]: doc };

  database[key] = newState;
  save(key);
};

const reset = <K extends keyof DB>(key?: K) => {
  if (key) {
    database[key] = initilalState.database[key];
    count[key] = initilalState.count[key];
  } else {
    Object.assign(database, initilalState.database);
    Object.assign(count, initilalState.count);
  }
};

export const db = {
  load,
  exists,
  collection,
  create,
  update,
  reset,
};

export * as auth from './auth';
export * from './user';
