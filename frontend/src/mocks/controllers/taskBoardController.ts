import { RestRequest } from 'msw';

import { db } from 'mocks/models';
import { paginate } from 'mocks/utils/paginate';
import { TaskBoard, TaskList, TaskCard } from 'models';

export const index = (req: RestRequest) => {
  const boards = db.where('taskBoards', 'userId', req.params.userId);
  const response = paginate({ req: req, allData: boards });

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
