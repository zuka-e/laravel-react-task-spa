import { CollectionBase, DocumentBase } from 'models';

export type TaskCardDocument = {
  userId: string;
  listId: string;
  title: string;
  content: string;
  deadline: Date;
  done: boolean;
} & DocumentBase;

export type TaskCardsCollection = CollectionBase<TaskCardDocument>;
