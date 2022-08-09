import { uuid } from 'mocks/utils/uuid';
import { TaskBoardsCollection } from './taskBoard';
import { TaskCardsCollection } from './taskCard';
import { TaskListsCollection } from './taskList';
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
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 初期値: テスト毎に`localStorage`をこの状態にリセット
 *
 * @property count 各`Document`の作成回数 (`id`に使用)
 * @property database `Collection`の集合
 */
const initialState = {
  count: {
    users: 0,
    taskBoards: 0,
    taskLists: 0,
    taskCards: 0,
  },
  database: {
    users: {} as UsersCollection,
    taskBoards: {} as TaskBoardsCollection,
    taskLists: {} as TaskListsCollection,
    taskCards: {} as TaskCardsCollection,
  },
};

// `initialState`が変更されないようにスプレッド演算子でコピー
/**
 * 各`Document`の作成回数 (`id`に使用)
 */
const count = { ...initialState.count };
/**
 * データの実体 (`Collection`の集合)
 */
const database = { ...initialState.database };

/**
 * `Collection`の集合
 */
export type DB = typeof database;

/**
 * モデル指定の`Collection`
 */
type Collection<T extends keyof DB> = DB[T];

/**
 * モデル指定の`Document`
 */
export type Doc<T extends keyof DB> = Collection<T>['id'];

/**
 * 1. 指定された`key`を持つJSONデータを`localStorage`から取得
 * 2. 指定された`key`を持つ`Collection`に取得したデータをコピー (上書き)
 */
const load = <T extends keyof DB>(model: T) => {
  // https://nextjs.org/docs/migrating/from-create-react-app#safely-accessing-web-apis
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(model) || '{}';
    database[model] = JSON.parse(storedData);
    count[model] = Object.keys(database[model]).length;
  }
};

/**
 * 指定された`Collection`をJSON変換して`localStorage`に保存
 */
const save = <T extends keyof DB>(model: T) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(model, JSON.stringify(database[model]));
  }
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
  const defaultValues: DocumentBase = {
    id: uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // `guestUser`など、プロパティ設定がある場合はデフォルト値を上書きする
  const newDoc = { ...defaultValues, ...doc };
  const newState = { ...database[model], [newDoc.id]: newDoc };

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
  value: unknown
) => {
  const matchedDocs = Object.values(database[model]).filter(
    (doc) => doc[column as keyof typeof doc] === value
  );
  return matchedDocs as Doc<T>[];
};

/**
 * 指定された`list`の値の何れかをプロパティ(`column`)の値として持つ`Document`を検索
 */
const whereIn = <T extends keyof DB>(
  model: T,
  column: keyof Doc<T>,
  list: unknown[]
) => {
  const matchedDocs = Object.values(database[model]).filter((doc) =>
    list.includes(doc[column as keyof typeof doc])
  );
  return matchedDocs as Doc<T>[];
};

/**
 * 指定された`Collection`の`Document`を更新
 */
const update = <T extends keyof DB>(model: T, doc: Doc<T>) => {
  const updated = { ...doc, updatedAt: new Date() };
  const newState = { ...database[model], [doc.id]: updated };

  database[model] = newState;
  save(model);

  return updated as Doc<T>;
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
    database[model] = initialState.database[model];
    count[model] = initialState.count[model];
  } else {
    Object.assign(database, initialState.database);
    Object.assign(count, initialState.count);
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
   *
   * @param  doc - `Document` | `Document`から`DocumentBase`を除外した型
   */
  create<T extends keyof DB>(
    model: T,
    doc: Doc<T> | Omit<Doc<T>, keyof DocumentBase>
  ): Doc<T>;
  /**
   * 指定された`value`をプロパティ(`column`)の値として持つ`Document`を検索
   *
   * @returns 合致する`Document`の配列
   */
  where<T extends keyof DB>(
    model: T,
    column: keyof Doc<T>,
    value: unknown
  ): Doc<T>[];
  /**
   * 指定された`list`の値の何れかをプロパティ(`column`)の値として持つ`Document`を検索
   *
   * @returns 合致する`Document`の配列
   */
  whereIn<T extends keyof DB>(
    model: T,
    column: keyof Doc<T>,
    list: unknown[]
  ): Doc<T>[];
  /**
   * 指定された`Collection`の`Document`を更新
   *
   * @returns 更新された`Document`
   */
  update<T extends keyof DB>(model: T, doc: Doc<T>): Doc<T>;
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
export const db: Readonly<Model> = {
  load,
  exists,
  collection,
  create,
  where,
  whereIn,
  update,
  remove,
  reset,
};

export * as auth from './auth';
export * from './user';
export * from './taskBoard';
export * from './taskList';
export * from './taskCard';
