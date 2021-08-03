import { DocumentBase } from 'models';

export const draggableItem = {
  card: 'card',
};

export type DragItem = {
  type: string;
  index: number;
  listIndex: number;
  id: string;
};

/** `Document`の`id`とその順番(index)の対応関係を示すオブジェクト */
export type IndexMap = { [docId: string]: number };

/** `Document`配列から`IndexMap`を作成 */
export const makeIndexMap = <T extends DocumentBase>(docs: T[]) => {
  const indexMap: IndexMap = {};

  docs.forEach((doc, i) => {
    indexMap[doc.id] = i;
  });

  return indexMap;
};

/** `Document`配列に`index`プロパティを追加  */
export const makeDocsWithIndex = <T extends DocumentBase>(
  docs: T[],
  indexMap: IndexMap
) => {
  return docs.map((doc) => {
    const docWithIndex = {
      ...doc,
      index: indexMap[doc.id],
    };
    return docWithIndex;
  });
};
