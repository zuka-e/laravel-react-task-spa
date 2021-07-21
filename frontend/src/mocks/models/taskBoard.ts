import { CollectionBase, DocumentBase } from 'models';

export type TaskBoardDocument = {
  userId: string;
  title: string;
  description: string;
} & DocumentBase;

export type TaskBoardsCollection = CollectionBase<TaskBoardDocument>;
