import { RestRequest } from 'msw';

import { TaskBoard, TaskList, TaskCard } from 'models';
import {
  CreateTaskBoardRequest,
  UpdateTaskBoardRequest,
} from 'store/thunks/boards';
import { db, TaskBoardDocument } from 'mocks/models';
import { paginate } from 'mocks/utils/paginate';

export const index = (req: RestRequest) => {
  const boards = db.where(
    'taskBoards',
    'userId',
    req.params.userId
  ) as TaskBoard[];
  const response = paginate({ req: req, allData: boards });

  return response;
};

export const store = (req: RestRequest<CreateTaskBoardRequest>) => {
  const response = db.create('taskBoards', {
    ...({} as TaskBoardDocument),
    userId: req.params.userId,
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
    const cards = db.where('taskCards', 'listId', list.id);
    list.cards = cards.map((card) => ({
      ...(card as unknown as TaskCard),
      boardId: board.id,
    }));
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

  const updated = db.update('taskBoards', { ...board, ...req.body });

  return updated as TaskBoard;
};

export const destroy = (req: RestRequest<UpdateTaskBoardRequest>) => {
  const board = db.where(
    'taskBoards',
    'id',
    req.params.boardId
  )[0] as TaskBoard;

  if (!board) return;

  db.remove('taskBoards', req.params.boardId);

  return board;
};
