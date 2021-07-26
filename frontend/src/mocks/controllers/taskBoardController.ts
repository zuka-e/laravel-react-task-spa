import { RestRequest } from 'msw';

import { TaskBoard, TaskList, TaskCard } from 'models';
import {
  CreateTaskBoardRequest,
  UpdateTaskBoardRequest,
} from 'store/thunks/boards';
import { db, TaskBoardDocument } from 'mocks/models';
import { paginate } from 'mocks/utils/paginate';

export const index = (req: RestRequest) => {
  const boards = db.where('taskBoards', 'userId', req.params.userId);
  const response = paginate({ req: req, allData: boards });

  return response;
};

export const store = (req: RestRequest<CreateTaskBoardRequest>) => {
  const newBoard = {} as TaskBoardDocument;
  const response = db.create('taskBoards', {
    newBoard,
    ...req.params.userId,
    ...req.body,
  }) as TaskBoard;

  return response;
};

export const show = (req: RestRequest) => {
  const board = db.where(
    'taskBoards',
    'id',
    req.params.boardId
  )[0] as TaskBoard;

  if (!board) return;

  board.lists = db.where(
    'taskLists',
    'boardId',
    req.params.boardId
  ) as unknown as TaskList[];

  board.lists.forEach((list) => {
    list.cards = db.where('taskCards', 'listId', list.id) as TaskCard[];
  });

  return board;
};

export const update = (req: RestRequest<UpdateTaskBoardRequest>) => {
  const board = db.where(
    'taskBoards',
    'id',
    req.params.boardId
  )[0] as TaskBoard;

  if (!board) return;

  const newState: TaskBoard = { ...board, ...req.body, updatedAt: new Date() };

  db.update('taskBoards', newState);

  return newState;
};
