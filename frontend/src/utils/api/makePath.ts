/** パスを構成する要素の内、モデル(テーブル)名として使用される文字列 */
const tableNames = [
  'users',
  'task_boards',
  'task_lists',
  'task_cards',
] as const;

/** `tableName`と`id`(省略可)との組み合わせ */
type PathSet = [table: typeof tableNames[number], id?: string];

/** `PathSet`の配列(可変長)を連結してパスを作成 */
export const makePath = (...props: PathSet[]) => {
  const reducer = (acc: string, current: typeof props[0]) => {
    const table = current[0];
    const id = current[1];
    return acc + `/${table}` + (id ? `/${id}` : '');
  };
  const path = props.reduce(reducer, '');
  return path;
};
