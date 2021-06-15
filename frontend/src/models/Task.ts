import { CollectionBase, DocumentBase } from 'models';

export type TaskBoard = {
  userId: string;
  title: string;
  description: string;
  lists: TaskList[];
} & DocumentBase;

export type TaskBoardsCollection = CollectionBase<TaskBoard>;

export type TaskList = {
  taskBoardId: string;
  title: string;
  description: string;
  cards: TaskCard[];
} & DocumentBase;

export type TaskListsCollection = CollectionBase<TaskList>;

export type TaskCard = {
  taskListId: string;
  title: string;
  content: string;
  deadline: Date;
  done: boolean;
} & DocumentBase;
