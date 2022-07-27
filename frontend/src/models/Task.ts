import type { CollectionBase, DocumentBase } from 'models';
import type { IndexMap } from 'utils/dnd';

export type TaskBoard = {
  userId: string;
  title: string;
  description: string;
  lists: TaskList[];
  listIndexMap: IndexMap;
  cardIndexMap: IndexMap;
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
