import { CollectionBase, DocumentBase } from 'models';

export type TaskBoard = {
  userId: string;
  title: string;
  description: string;
  lists: TaskList[];
  listIndexMap: {};
  cardIndexMap: {};
} & DocumentBase;

export type TaskBoardsCollection = CollectionBase<TaskBoard>;

export type TaskList = {
  boardId: string;
  title: string;
  description: string;
  cards: TaskCard[];
} & DocumentBase;

export type TaskListsCollection = CollectionBase<TaskList>;

export type TaskCard = {
  listId: string;
  boardId: string;
  title: string;
  content: string;
  deadline: Date;
  done: boolean;
} & DocumentBase;
