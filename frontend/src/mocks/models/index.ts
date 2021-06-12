import { UsersCollection } from './user';

/**
 * `extends`した`interface`は動的プロパティ`DocumentBase`を持つ
 */
export interface CollectionBase {
  [uuid: string]: DocumentBase;
}

/**
 * `extends`した`interface`は必須プロパティを持つ
 */
export interface DocumentBase {
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
/**
 * 各`Document`の作成回数 (`id`に使用)
 */
const count = { ...initilalState.count };
/**
 * データの実体 (`Collection`の集合)
 */
const database = { ...initilalState.database };

/**
 * `Collection`の集合
 */
type DB = typeof database;

/**
 * モデル指定の`Collection`
 */
type Collection<T extends keyof DB> = DB[T];

/**
 * モデル指定の`Document`
 */
type Doc<T extends keyof DB> = Collection<T>['id'];

/**
 * 1. 指定された`key`を持つJSONデータを`localStorage`から取得
 * 2. 指定された`key`を持つ`Collection`に取得したデータをコピー (上書き)
 */
const load = <T extends keyof DB>(model: T) => {
  const storedData = localStorage.getItem(model) || '{}';
  database[model] = JSON.parse(storedData);
  count[model] = Object.keys(database[model]).length;
};

/**
 * 指定された`Collection`をJSON変換して`localStorage`に保存
 */
const save = <T extends keyof DB>(model: T) => {
  localStorage.setItem(model, JSON.stringify(database[model]));
};

/**
 * 指定された`Collection`の`Document`の存在有無を確認
 */
const exists = <T extends keyof DB>(model: T) =>
  Object.keys(database[model]).length > 0;

/**
 * 指定された`Collection`のコピーを返却
 */
const collection = <T extends keyof DB>(model: T) => {
  const collectionClone = { ...database[model] };
  return collectionClone; // 参照のみ許可 (直接データを返さない)
};

/**
 * 指定された`Collection`に引数の`Document`を新たに作成
 */
const create = <T extends keyof DB>(model: T, doc: Doc<T>) => {
  const defaultValues = {
    id: count[model] + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // `guestUser`など、プロパティ設定がある場合はデフォルト値を上書きする
  const newDoc = { ...defaultValues, ...doc };
  const newState = { ...database[model], [String(newDoc.id)]: newDoc };

  database[model] = newState;
  count[model] += 1;
  save(model);
  return newDoc;
};

/**
 * 指定された`value`をプロパティ(`column`)の値として持つ`Document`を検索
 */
const where = <T extends keyof DB>(
  model: T,
  column: keyof Doc<T>,
  value: any
) => {
  const matchedDocs = Object.values(database[model]).filter(
    (doc) => doc[column as keyof typeof doc] === value
  );
  return matchedDocs as Doc<T>[];
};

/**
 * 指定された`Collection`の`Document`を更新
 */
const update = <T extends keyof DB>(model: T, doc: Doc<T>) => {
  const uuid = String(doc.id);
  const newState = { ...database[model], [uuid]: doc };

  database[model] = newState;
  save(model);
};

/**
 * 指定された`Collection`の`Document`を削除
 *
 * @returns 削除された`Document` | `undefined`(`docId`が存在しない場合)
 */
const remove = <T extends keyof DB>(model: T, docId: keyof DB[T]) => {
  const { [docId]: deleted, ...newState } = database[model];

  database[model] = newState as Collection<T>;
  save(model);

  return deleted as Doc<T>;
};

/**
 * 指定された`Collection`の`Document`を初期化 (指定しない場合、全ての`Collection`が対象)
 */
const reset = <T extends keyof DB>(model?: T) => {
  if (model) {
    database[model] = initilalState.database[model];
    count[model] = initilalState.count[model];
  } else {
    Object.assign(database, initilalState.database);
    Object.assign(count, initilalState.count);
  }
};

interface Model {
  /**
   * 1. 指定された`model`を持つJSONデータを`localStorage`から取得
   * 2. 指定された`model`を持つ`Collection`に取得したデータをコピー (上書き)
   */
  load<T extends keyof DB>(model: T): void;
  /**
   * 指定された`Collection`の`Document`の存在有無を確認
   */
  exists<T extends keyof DB>(model: T): boolean;
  /**
   * 指定された`Collection`のコピーを返却
   */
  collection<T extends keyof DB>(model: T): DB[T];
  /**
   * 指定された`Collection`に引数の`Document`を新たに作成
   * @param  doc - `Document`
   */
  create<T extends keyof DB>(model: T, doc: Doc<T>): Doc<T>;
  /**
   * 指定された`value`をプロパティ(`column`)の値として持つ`Document`を検索
   *
   * @returns 合致する`Document`の配列
   */
  where<T extends keyof DB>(
    model: T,
    column: keyof Doc<T>,
    value: any
  ): Doc<T>[];
  /**
   * 指定された`Collection`の`Document`を更新
   */
  update<T extends keyof DB>(model: T, doc: Doc<T>): void;
  /**
   * 指定された`Collection`から`Document`を削除
   *
   * @returns 削除された`Document` | `undefined`(`docId`が存在しない場合)
   */
  remove<T extends keyof DB>(model: T, docId: keyof DB[T]): Doc<T> | undefined;
  /**
   * 指定された`Collection`の`Document`を初期化 (指定しない場合、全ての`Collection`が対象)
   */
  reset<T extends keyof DB>(model?: T): void;
}

/**
 * データを操作するメソッドを持つ
 */
export const db: Model = {
  load,
  exists,
  collection,
  create,
  where,
  update,
  remove,
  reset,
};

export * as auth from './auth';
export * from './user';
