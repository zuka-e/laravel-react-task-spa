import { CollectionBase, DocumentBase } from 'models';

export type TaskListDocument = {
  userId: string;
  boardId: string;
  title: string;
  description: string;
} & DocumentBase;

export type TaskListsCollection = CollectionBase<TaskListDocument>;
