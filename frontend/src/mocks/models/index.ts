import { UsersCollection } from './user';

/**
 * 継承した`interface`は動的プロパティ`Document`を持つ
 */
export interface Collection {
  [uuid: string]: Document;
}

/**
 * 継承した`interface`は必須プロパティを持つ
 */
export interface Document {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初期値: テスト毎に`localStorage`をこの状態にリセット
 *
 * @property count 各`Document`の作成回数 (`id`に使用)
 * @property database `Collection`の集合
 */
const initilalState = {
  count: {
    users: 0,
  },
  database: {
    users: {} as UsersCollection,
  },
};

// `initilalState`が変更されないようにスプレッド演算子でコピー
const count = { ...initilalState.count };
const database = { ...initilalState.database };

/**
 * `Collection`の集合
 */
type DB = typeof database;

/**
 * 1. 指定された`key`を持つJSONデータを`localStorage`から取得
 * 2. 指定された`key`を持つ`Collection`に取得したデータをコピー (上書き)
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 */
const load = <K extends keyof DB>(key: K) => {
  const storedData = localStorage.getItem(key) || '{}';
  Object.assign(database[key], JSON.parse(storedData));
};

/**
 * 指定された`Collection`をJSON変換して`localStorage`に保存
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 */
const save = <K extends keyof DB>(key: K) => {
  localStorage.setItem(key, JSON.stringify(database[key]));
};

/**
 * 指定された`Collection`の`Document`の存在有無を確認
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 */
const exists = <K extends keyof DB>(key: K) =>
  Object.keys(database[key]).length > 0;

/**
 * 指定された`Collection`のコピーを返却
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 */
const collection = <K extends keyof DB>(key: K) => {
  const collectionClone = { ...database[key] };
  return collectionClone; // 参照のみ許可 (直接データを返さない)
};

/**
 * 指定された`Collection`に引数の`Document`を新たに作成
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 * @param  doc - `Document`
 */
const create = <K extends keyof DB, T extends DB[K]>(key: K, doc: T['id']) => {
  const defaultValues = {
    id: count[key] + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // `guestUser`など、プロパティ設定がある場合はデフォルト値を上書きする
  const newDoc = { ...defaultValues, ...doc };
  const newState = { ...database[key], [String(newDoc.id)]: newDoc };

  database[key] = newState;
  count[key] += 1;
  save(key);
};

/**
 * 指定された`value`をプロパティ(`column`)の値として持つ`Document`を検索
 *
 * @returns 合致する`Document`の配列
 */
const where = <K extends keyof DB, T extends DB[K]>(
  key: K,
  column: keyof T['id'],
  value: any
) =>
  Object.values(database[key]).filter(
    (doc) => doc[column as keyof typeof doc] === value
  );

/**
 * 指定された`Collection`の`Document`を更新
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 * @param  doc - `Document`
 */
const update = <K extends keyof DB, T extends DB[K]>(key: K, doc: T['id']) => {
  const uuid = String(doc.id);
  const newState = { ...database[key], [uuid]: doc };

  database[key] = newState;
  save(key);
};

/**
 * 指定された`Collection`の`Document`を初期化 (指定しない場合、全ての`Collection`が対象)
 *
 * @param  key - 各`Collection`に割り当てられたキー名
 */
const reset = <K extends keyof DB>(key?: K) => {
  if (key) {
    database[key] = initilalState.database[key];
    count[key] = initilalState.count[key];
  } else {
    Object.assign(database, initilalState.database);
    Object.assign(count, initilalState.count);
  }
};

/**
 * データを操作する各メソッドをプロパティとして持つ
 */
export const db = {
  load,
  exists,
  collection,
  where,
  create,
  update,
  reset,
};

export * as auth from './auth';
export * from './user';
