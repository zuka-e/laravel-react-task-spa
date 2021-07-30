import { RestRequest } from 'msw';

import { TaskCard } from 'models';
import { CreateTaskCardRequest } from 'store/thunks/cards';
import { db, TaskCardDocument } from 'mocks/models';

export const index = (req: RestRequest) => {};

export const store = (req: RestRequest<CreateTaskCardRequest>) => {
  const parent = db.where('taskLists', 'id', req.params.listId)[0];
  const newCard = db.create('taskCards', {
    ...({} as TaskCardDocument),
    listId: req.params.listId,
    ...req.body,
  });

  const response: TaskCard = { ...newCard, boardId: parent.boardId };

  return response;
};

export const show = (req: RestRequest) => {};

export const update = (req: RestRequest) => {};

export const destroy = (req: RestRequest) => {};
