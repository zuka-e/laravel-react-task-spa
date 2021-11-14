export type SortOperation<T> = {
  column: keyof T;
  direction?: 'asc' | 'desc';
};

/**
 * `Array.sort()`の比較関数として利用
 * 1. `number`型、`Date`型の場合は数値比較
 * 2. 上記以外の型は`string`型に変換して比較
 *
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * */
export const compare = <T>(
  a: T,
  b: T,
  key: keyof T,
  direction?: 'asc' | 'desc'
) => {
  const process = () => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'number' && typeof valueB === 'number')
      return valueA - valueB;
    else if (valueA instanceof Date && valueB instanceof Date)
      return valueA.valueOf() - valueB.valueOf();

    const stringValueA = String(valueA);
    const stringValueB = String(valueB);

    if (stringValueA < stringValueB) return -1;
    else if (stringValueA > stringValueB) return 1;
    else return 0;
  };

  return direction === 'desc' ? -process() : process();
};
