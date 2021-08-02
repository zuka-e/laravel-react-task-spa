import { RestRequest } from 'msw';

import { TaskCard } from 'models';
import { CreateTaskCardRequest } from 'store/thunks/cards';
import { db, TaskCardDocument } from 'mocks/models';

export const index = (req: RestRequest) => {};

export const store = (req: RestRequest<CreateTaskCardRequest>) => {
  const newCard = db.create('taskCards', {
    ...({} as TaskCardDocument),
    listId: req.params.listId,
    ...req.body,
  });

  const response: TaskCard = { ...newCard };

  return response;
};

export const show = (req: RestRequest) => {};

export const update = (req: RestRequest) => {};

export const destroy = (req: RestRequest) => {};
