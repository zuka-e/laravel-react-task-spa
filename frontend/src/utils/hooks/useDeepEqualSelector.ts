import { deepStrictEqual } from 'assert';

import { RootState } from 'store';
import { useAppSelector } from '.';

/**
 * - 二つのオブジェクトの各プロパティ値の等価性を検証
 * - node`assert`の`deepStrictEqual`をロジックに使用
 * - `useSelector`の比較メソッド用に`boolean`を返却する仕様
 *
 * @returns 等価の場合`true`
 */
const deepEqual = <T>(left: T, right: T) => {
  try {
    deepStrictEqual(left, right);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * - `useAppSelector`の拡張
 * - 比較ロジックをデフォルトの`===`から`deepStrictEqual`に変更
 *
 * @see https://react-redux.js.org/api/hooks#equality-comparisons-and-updates
 */
export const useDeepEqualSelector = <T>(selector: (state: RootState) => T) =>
  useAppSelector(selector, deepEqual);
